const { chromium } = require("playwright");
const TelegramBot = require("node-telegram-bot-api");

const bot = new TelegramBot(
process.env.BOT_TOKEN,
{
polling:false
}
);

const chatId=process.env.CHAT_ID;

async function sleep(ms){
return new Promise(r=>setTimeout(r,ms));
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

const txt=
card.innerText || "";

if(
txt.includes("Akan hadir") ||
txt.includes("Besok") ||
txt.includes("Peringat")
){
return;
}

const harga=
txt.match(
/Rp[\d\.]+/
)?.[0];

if(!harga) return;


/*
ambil diskon dari semua isi card
*/

let diskon=0;

const persen=
txt.match(
/(\d+)%/
);

if(
persen
){
diskon=
parseInt(
persen[1]
);
}

if(
diskon<70
){
return;
}

let link=
card.href;

if(
link &&
!link.startsWith(
"http"
)
){

link=
"https://www.blibli.com"+
link;

}

hasil.push({

harga,
diskon,
link

});

});

return hasil;

});

console.log("");
console.log(
"=== DISKON >=70% ==="
);

if(
products.length===0
){

console.log(
"Tidak ada diskon >=70%"
);

}else{

let pesan=
"🔥 FLASH SALE BLIBLI 🔥\n\n";

products.forEach(item=>{

console.log(
`${item.harga} | ${item.diskon}%`
);

pesan+=
`💰 ${item.harga}\n`+
`🔥 Diskon ${item.diskon}%\n`+
`🔗 ${item.link}\n\n`;

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
"Sleep..."
);

await sleep(
300000
);

}

})();
