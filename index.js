const { chromium } = require("playwright");
const TelegramBot = require("node-telegram-bot-api");

const bot = new TelegramBot(
process.env.BOT_TOKEN,
{polling:false}
);

const chatId=process.env.CHAT_ID;

async function sleep(ms){
return new Promise(resolve=>setTimeout(resolve,ms));
}

async function checkFlashsale(){

let browser;

try{

browser=await chromium.launch({

headless:true,

args:[
"--no-sandbox",
"--disable-setuid-sandbox",
"--disable-dev-shm-usage",
"--disable-blink-features=AutomationControlled"
]

});

const page=await browser.newPage({

viewport:{
width:1366,
height:768
},

userAgent:
"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0 Safari/537.36"

});

console.log(
"Buka flashsale..."
);

await page.goto(
"https://www.blibli.com/flashsale",
{
waitUntil:"networkidle",
timeout:60000
}
);

await page.waitForTimeout(
10000
);

console.log(
"Title:",
await page.title()
);

/*
scroll beberapa kali
*/

for(let i=0;i<5;i++){

await page.mouse.wheel(
0,
1500
);

await page.waitForTimeout(
2000
);

}

const products=
await page.evaluate(()=>{

const hasil=[];

/*
ambil card produk
*/

const cards=[

...document.querySelectorAll(
'[class*="product"]'
),

...document.querySelectorAll(
'[class*="Product"]'
),

...document.querySelectorAll(
'[class*="card"]'
)

];

cards.forEach(card=>{

const text=
card.innerText?.trim();

if(!text) return;

const lines=
text
.split("\n")
.map(
x=>x.trim()
)
.filter(Boolean);

let nama="";
let harga="";
let link="";

/*
ambil nama
*/

for(const line of lines){

if(

!line.includes("Rp") &&
line.length>10 &&
!line.includes("Beli sekarang") &&
!line.includes("Cepat habis")

){

nama=line;

break;

}

}

/*
ambil harga
*/

for(const line of lines){

const hargaMatch=
line.match(
/Rp[\d\.]+/
);

if(
hargaMatch
){

harga=
hargaMatch[0];

break;

}

}

/*
ambil link
*/

const a=
card.querySelector(
"a"
);

if(
a &&
a.href
){

link=
a.href.split("?")[0];

}

if(

!nama ||
!harga ||
!link

){
return;
}

hasil.push({

nama,
harga,
link

});

});

/*
hapus duplikat
*/

return [

...new Map(

hasil.map(
item=>[
item.link,
item
]
)

).values()

]

.slice(0,10);

});

console.log(
""
);

console.log(
"=== FLASH SALE ==="
);

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

}else{

let pesan=
"🔥 FLASH SALE BLIBLI 🔥\n\n";

products.forEach(item=>{

console.log(
"Nama:",
item.nama
);

console.log(
"Harga:",
item.harga
);

console.log(
"Link:",
item.link
);

console.log(
"-------------"
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

}

await browser.close();

}catch(err){

console.log(
"ERROR:",
err.message
);

if(
browser
){

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
