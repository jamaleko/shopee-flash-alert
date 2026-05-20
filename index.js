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

const products=await page.evaluate(()=>{

const hasil=[];

const cards=document.querySelectorAll(
'a[href*="/p/"]'
);

cards.forEach(card=>{

const text=card.innerText?.trim();

if(!text) return;

if(
text.includes("Akan hadir")
||
text.includes("Besok")
||
text.includes("Peringat")
){
return;
}

if(
text.includes("Rp??")
){
return;
}

if(
!text.match(/Rp[\d\.]+/)
){
return;
}

hasil.push(
text
.replace(/\n/g," | ")
.replace(/\s+/g," ")
);

});

return [...new Set(hasil)]
.slice(0,10);

});

console.log("");
console.log("=== DISKON GILA ===");

if(products.length===0){

console.log(
"Tidak ada produk ditemukan"
);

}else{

products.forEach(item=>{

console.log("----------------");
console.log(item);

});

}

if(products.length){

const pesan=
"🔥 FLASH SALE BLIBLI 🔥\n\n"+
products.join("\n\n");

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
"Sleep 60 detik..."
);

await sleep(
300000
);

}

})();
