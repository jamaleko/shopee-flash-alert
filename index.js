const { chromium } = require("playwright");
const TelegramBot = require("node-telegram-bot-api");

const bot = new TelegramBot(
process.env.BOT_TOKEN,
{ polling:false }
);

const chatId =
process.env.CHAT_ID;

async function sleep(ms){

return new Promise(
r=>setTimeout(r,ms)
);

}

async function run(){

let browser;

try{

browser=
await chromium.launch({

headless:true,

args:[

"--no-sandbox",
"--disable-setuid-sandbox",
"--disable-dev-shm-usage",
"--disable-gpu"

]

});

const page=
await browser.newPage({

viewport:{
width:1366,
height:768
},

userAgent:
"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0 Safari/537.36"

});

/*
matikan resource berat
TAPI JANGAN matikan javascript
*/

await page.route(
"**/*",
async(route)=>{

const type=
route.request().resourceType();

if(

type==="image"||
type==="media"||
type==="font"

){

await route.abort();

}else{

await route.continue();

}

}
);

console.log(
"Buka flashsale..."
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

/*
tunggu react render
*/

await page.waitForTimeout(
15000
);

/*
scroll pelan
*/

for(let i=0;i<3;i++){

await page.mouse.wheel(
0,
1200
);

await page.waitForTimeout(
3000
);

}

console.log(
"Scraping..."
);

const products=
await page.evaluate(()=>{

const hasil=[];

const semua=[
...document.querySelectorAll("a")
];

semua.forEach(a=>{

const text=
a.innerText?.trim();

if(!text)return;

if(
!text.includes("Rp")
)return;

const lines=
text
.split("\n")
.map(x=>x.trim())
.filter(Boolean);

let nama="";
let harga="";

for(const line of lines){

if(

!harga &&
line.match(/Rp[\d\.]+/)

){

harga=
line.match(
/Rp[\d\.]+/
)[0];

}

if(

!nama &&
!line.includes("Rp") &&
line.length>8 &&
!line.includes("Beli sekarang") &&
!line.includes("Cepat habis")

){

nama=line;

}

}

if(
!nama ||
!harga
){
return;
}

hasil.push({

nama,

harga,

link:
a.href.split("?")[0]

});

});

return [

...new Map(

hasil.map(
x=>[
x.link,
x
]
)

).values()

]

.slice(0,10);

});

console.log(
"Jumlah produk:",
products.length
);

if(
products.length===0
){

console.log(
"Tidak ada produk ditemukan"
);

return;

}

let pesan=
"🔥 FLASH SALE BLIBLI 🔥\n\n";

products.forEach(item=>{

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
"------------"
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

await run();

console.log(
"Sleep 5 menit..."
);

await sleep(
300000
);

}

})();
