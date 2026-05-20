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

async function checkFlashsale(){

let browser = null;

try{

browser =
await chromium.launch({

headless:true,

args:[
"--no-sandbox",
"--disable-setuid-sandbox",
"--disable-dev-shm-usage",
"--disable-blink-features=AutomationControlled"
]

});

const page =
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
scroll banyak
*/

for(let i=0;i<10;i++){

await page.mouse.wheel(
0,
2500
);

console.log(
"Scroll",
i+1
);

await page.waitForTimeout(
3000
);

}

console.log(
"Title:",
await page.title()
);

/*
AMBIL SEMUA LINK PRODUK
*/

const products =
await page.$$eval(
'a[href*="/p/"]',
els=>{

const hasil=[];

els.forEach(el=>{

const text =
el.innerText?.trim();

if(!text) return;

if(
text.includes("Masuk") ||
text.includes("Daftar") ||
text.includes("Kategori")
){
return;
}

const hargaMatch =
text.match(/Rp[\d\.]+/);

if(!hargaMatch) return;

const lines =
text
.split("\n")
.map(x=>x.trim())
.filter(Boolean);

let nama = "Produk";

for(const line of lines){

if(

!line.includes("Rp") &&
line.length > 5 &&
!line.includes("Beli sekarang") &&
!line.includes("Cepat habis")

){

nama = line;
break;

}

}

hasil.push({

nama,

harga:hargaMatch[0],

link:
el.href.split("?")[0]

});

});

return [...new Map(

hasil.map(
x=>[
x.link,
x
]
)

).values()]

.slice(0,10);

}
);

console.log("");
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

let pesan =
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
"-------------"
);

pesan +=

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
