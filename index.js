const { chromium } = require("playwright");
const TelegramBot = require("node-telegram-bot-api");

const bot=new TelegramBot(
process.env.BOT_TOKEN,
{polling:false}
);

const chatId=
process.env.CHAT_ID;

async function sleep(ms){

return new Promise(
r=>setTimeout(r,ms)
);

}

async function checkFlashsale(){

let browser=null;

try{

browser=
await chromium.launch({

headless:true,

args:[
"--no-sandbox",
"--disable-setuid-sandbox",
"--disable-dev-shm-usage"
]

});

const page=
await browser.newPage({

viewport:{
width:1366,
height:768
},

userAgent:
"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"

});

console.log(
"Buka flashsale..."
);

const apiData=[];

/*
tangkap response API
*/

page.on(
"response",
async(response)=>{

try{

const url=
response.url();

if(

url.includes("flash")||
url.includes("product")||
url.includes("promo")

){

const contentType=
response.headers()["content-type"];

if(
contentType &&
contentType.includes(
"application/json"
)
){

const data=
await response.json();

apiData.push(data);

}

}

}catch(e){}

}
);

await page.goto(
"https://www.blibli.com/flashsale",
{
waitUntil:"domcontentloaded",
timeout:90000
}
);

console.log(
"Halaman terbuka"
);

await page.waitForTimeout(
20000
);

/*
paksa load
*/

for(
let i=0;
i<10;
i++
){

await page.mouse.wheel(
0,
2500
);

await page.waitForTimeout(
2000
);

}

console.log(
"Title:",
await page.title()
);

console.log(
"API ditemukan:",
apiData.length
);

const products=[];

/*
rekursif cari data produk
*/

function cariProduk(obj){

if(!obj) return;

if(
Array.isArray(obj)
){

obj.forEach(
x=>cariProduk(x)
);

return;

}

if(
typeof obj==="object"
){

const nama=

obj.name||
obj.title||
obj.productName||
obj.productTitle||
"";

const harga=

obj.price?.toString()||
obj.salePrice?.toString()||
obj.finalPrice?.toString()||
"";

const link=

obj.url||
obj.productUrl||
obj.seoUrl||
"";

if(
nama &&
harga
){

products.push({

nama,

harga:
harga.includes("Rp")
?
harga
:
`Rp${harga}`,

link:
link.startsWith("http")
?
link
:
`https://www.blibli.com${link}`

});

}

for(
const key in obj
){

cariProduk(
obj[key]
);

}

}

}

apiData.forEach(
x=>cariProduk(x)
);

/*
hapus duplikat
*/

const finalProducts=

[...new Map(

products.map(
x=>[
x.link,
x
]
)

).values()]

.slice(
0,
10
);

console.log(
"Jumlah produk:",
finalProducts.length
);

console.log(
"=== FLASH SALE ==="
);

if(
finalProducts.length===0
){

console.log(
"Tidak ada produk ditemukan"
);

return;

}

let pesan=
"🔥 FLASH SALE BLIBLI 🔥\n\n";

finalProducts.forEach(item=>{

console.log(
item.nama
);

console.log(
item.harga
);

console.log(
item.link
);

console.log(
"----------------"
);

pesan+=

`📦 ${item.nama}

💰 ${item.harga}

🔗 ${item.link}

`;

});

await bot.sendMessage(
chatId,
pesan
);

console.log(
"Telegram terkirim"
);

}catch(err){

console.log(
"ERROR:",
err.message
);

}finally{

if(browser){

await browser.close();

}

}

}

(async()=>{

while(true){

await checkFlashsale();

console.log(
"Sleep 5 menit..."
);

await sleep(
300000
);

}

})();
