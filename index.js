const { chromium } = require("playwright");
const TelegramBot = require("node-telegram-bot-api");

const bot = new TelegramBot(
process.env.BOT_TOKEN,
{ polling:false }
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

console.log("Buka flashsale...");

await page.goto(
"https://www.blibli.com/flashsale",
{
waitUntil:"domcontentloaded",
timeout:60000
}
);

await page.waitForTimeout(15000);

console.log(
"Title:",
await page.title()
);

/*
scroll supaya produk muncul
*/

await page.mouse.wheel(
0,
1500
);

await page.waitForTimeout(
5000
);

const products=await page.evaluate(()=>{

const hasil=[];

const cards=[
...document.querySelectorAll("a")
];

cards.forEach(card=>{

const text=
card.innerText?.trim();

if(!text) return;

/*
buang menu/header
*/

if(

text.includes("Masuk")||
text.includes("Daftar")||
text.includes("Kategori")||
text.includes("Peringat")||
text.includes("Berlangsung")||
text.includes("Besok")||
text.includes("Akan hadir")

){
return;
}

/*
harus ada harga
*/

const harga=
text.match(
/Rp[\d\.]+/
);

if(!harga) return;

const link=
card.href;

if(
!link ||
!link.startsWith("http")
){
return;
}

/*
pecah text
*/

const lines=text
.split("\n")
.map(x=>x.trim())
.filter(Boolean);

let nama="Produk";

for(let i=0;i<lines.length;i++){

const baris=
lines[i];

/*
nama produk:
bukan harga
minimal panjang
*/

if(

!baris.includes("Rp")&&
baris.length>10

){

nama=baris;

break;

}

}

hasil.push({

nama:nama,

harga:harga[0],

link:
link.split("?")[0]

});

});

/*
hapus duplikat
*/

return [...new Map(

hasil.map(
item=>[
item.link,
item
]
)

).values()]

.slice(0,10);

});

console.log("");
console.log(
"=== FLASH SALE ==="
);

if(products.length===0){

console.log(
"Tidak ada produk ditemukan"
);

}else{

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
"---------------"
);

});

let pesan=
"🔥 FLASH SALE BLIBLI 🔥\n\n";

products.forEach(item=>{

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
