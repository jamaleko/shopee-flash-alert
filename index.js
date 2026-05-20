const { chromium } =
require("playwright-extra");

const StealthPlugin =
require("puppeteer-extra-plugin-stealth");

chromium.use(
StealthPlugin()
);

const TelegramBot =
require("node-telegram-bot-api");

const bot =
new TelegramBot(
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

let browser=null;

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
}

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
10000
);

/*
scroll kecil
*/

await page.mouse.wheel(
0,
1000
);

await page.waitForTimeout(
3000
);

console.log(
"Title:",
await page.title()
);

/*
JANGAN BODY INNER TEXT
langsung ambil semua text Rp
*/

const products =
await page.evaluate(()=>{

const hasil=[];

const semua =
[
...document.querySelectorAll("*")
];

for(const el of semua){

try{

const text =
el.textContent?.trim();

if(!text)
continue;

if(
!text.includes("Rp")
)
continue;

if(
text.length > 200
)
continue;

const harga =
text.match(
/Rp[\d\.]+/
)?.[0];

if(!harga)
continue;

const lines =
text
.split("\n")
.map(x=>x.trim())
.filter(Boolean);

let nama="Produk";

for(const line of lines){

if(

!line.includes("Rp") &&
line.length > 5 &&
!line.includes("Beli sekarang")

){

nama=line;
break;

}

}

hasil.push({

nama,
harga

});

}catch(e){}

}

return hasil.slice(0,10);

});

console.log(
"Jumlah produk:",
products.length
);

if(
products.length===0
){

console.log(
"Tidak ada produk"
);

}else{

let pesan =
"🔥 FLASH SALE BLIBLI 🔥\n\n";

for(const item of products){

console.log(
item.nama
);

console.log(
item.harga
);

console.log(
"-----------"
);

pesan +=

`📦 ${item.nama}

💰 ${item.harga}

`;

}

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
