const { chromium } = require("playwright");

function sleep(ms){

return new Promise(
r=>setTimeout(r,ms)
);

}

async function cekFlashSale(){

let browser;

try{

console.log(
"Connect browserless..."
);

browser=
await chromium.connect(
`wss://production-sfo.browserless.io?token=${process.env.BROWSERLESS_TOKEN}`
);

console.log(
"Connected"
);

const context=
await browser.newContext({

userAgent:
"Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109 Mobile Safari/537.36",

locale:
"id-ID",

timezoneId:
"Asia/Jakarta",

viewport:{
width:390,
height:844
}

});


// load cookie manual kalau ada
if(
process.env.SHOPEE_COOKIE
){

const cookies=
process.env.SHOPEE_COOKIE
.split(";")
.map(
x=>{

const parts=
x.trim().split("=");

const name=
parts.shift();

const value=
parts.join("=");

return{

name,
value,

domain:
".shopee.co.id",

path:
"/"

};

}
);

await context.addCookies(
cookies
);

console.log(
"Cookie:",
cookies.length
);

}

const page=
await context.newPage();

await page.setExtraHTTPHeaders({

"accept":
"*/*",

"accept-language":
"en-GB,en-US;q=0.9,en;q=0.8",

"sec-ch-ua":
'"Not_A Brand";v="99","Google Chrome";v="109","Chromium";v="109"',

"sec-ch-ua-mobile":
"?1",

"sec-ch-ua-platform":
'"Android"'

});


// log semua API flash
page.on(
"response",
async(response)=>{

try{

const url=
response.url();

if(
url.includes(
"/api/v4/flash_sale"
)
){

console.log(
"\n=== API ==="
);

console.log(
"Status:",
response.status()
);

console.log(
"URL:",
url
);

}

}catch{}

}
);

console.log(
"Buka Shopee..."
);

const apiPromise=
page.waitForResponse(
r=>
r.url().includes(
"/api/v4/flash_sale/get_all_itemids"
),
{
timeout:60000
}
);

await page.goto(
"https://shopee.co.id/flash_sale?categoryId=0&promotionId=268078273540098",
{
waitUntil:
"domcontentloaded",

timeout:
120000
}
);

console.log(
"Tunggu render..."
);

await page.waitForTimeout(
15000
);

const api=
await apiPromise;

console.log(
"\n=== RESPONSE ==="
);

console.log(
"Status:",
api.status()
);

const data=
await api.json();

console.log(
JSON.stringify(
data,
null,
2
)
);


const items=
data?.data?.item_brief_list||[];

console.log(
"\nJumlah item:",
items.length
);


for(
const item
of items
){

console.log(
"----------------"
);

console.log(
"ID:",
item.itemid
);

console.log(
"Nama:",
item.name
);

console.log(
"Harga:",
item.price
);

console.log(
"Stock:",
item.stock
);

}

await page.screenshot({

path:
"hasil.png"

});

console.log(
"\nScreenshot selesai"
);

await context.close();

await browser.close();

return true;

}catch(e){

console.log(
"\nERROR:"
);

console.log(
e.message
);

try{

await browser.close();

}catch{}

return false;

}

}

(async()=>{

while(true){

const ok=
await cekFlashSale();

if(ok){

console.log(
"\nSleep 5 menit..."
);

await sleep(
300000
);

}else{

console.log(
"\nRetry 30 detik..."
);

await sleep(
30000
);

}

}

})();
