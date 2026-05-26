const { chromium } = require("playwright");

async function run(){

let browser;

try{

console.log(
"Connect browserless..."
);

browser=
await chromium.connectOverCDP(
`wss://production-sfo.browserless.io?token=${process.env.BROWSERLESS_TOKEN}`
);

console.log(
"Connected"
);

const context=
browser.contexts()[0] ||
await browser.newContext({

userAgent:
"Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Mobile Safari/537.36",

locale:"id-ID"

});


// ambil cookie dari ENV
if(
process.env.SHOPEE_COOKIE
){

const cookies=
process.env.SHOPEE_COOKIE
.split(";")
.map(x=>{

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

});

await context.addCookies(
cookies
);

console.log(
"Cookie loaded:",
cookies.length
);

}

const page=
await context.newPage();

await page.setExtraHTTPHeaders({

"accept":"*/*",

"accept-language":
"en-GB,en-US;q=0.9,en;q=0.8",

"referer":
"https://shopee.co.id/flash_sale?categoryId=0&promotionId=268078273540098",

"x-api-source":
"rweb",

"x-requested-with":
"XMLHttpRequest",

"x-shopee-language":
"id",

"x-sz-sdk-version":
"1.12.39",

"af-ac-enc-dat":
process.env.AF_DATA,

"af-ac-enc-sz-token":
process.env.AF_TOKEN,

"sec-ch-ua":
"Not_A Brand";v="99","Google Chrome";v="109","Chromium";v="109",

"sec-ch-ua-mobile":
"?1",

"sec-ch-ua-platform":
"Android"

});

page.on(
"response",
async(res)=>{

try{

const url=
res.url();

if(
url.includes(
"get_all_itemids"
)
){

console.log(
"\nAPI:",
res.status()
);

const data=
await res.json();

console.log(
JSON.stringify(
data,
null,
2
)
);

}

}catch(e){}

}
);

console.log(
"Buka Shopee..."
);

await page.goto(
"https://shopee.co.id/flash_sale?categoryId=0&promotionId=268078273540098",
{
waitUntil:
"domcontentloaded",
timeout:
60000
}
);

await page.waitForTimeout(
15000
);

}
catch(e){

console.log(
"ERROR:",
e.message
);

}
finally{

if(browser){

await browser.close();

}

console.log(
"Closed"
);

}

}

run();
