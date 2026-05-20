const { chromium } = require("playwright");
const TelegramBot = require("node-telegram-bot-api");
const fs = require("fs");

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

browser =
await chromium.launch({

headless:true,

args:[
"--no-sandbox",
"--disable-setuid-sandbox",
"--disable-dev-shm-usage",
"--disable-gpu"
]

});

const page =
await browser.newPage({

viewport:{
width:1280,
height:720
},

userAgent:
"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0 Safari/537.36"

});

console.log(
"Buka blibli..."
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
jangan lama-lama
*/

await page.waitForTimeout(
8000
);

console.log(
"Ambil screenshot..."
);

/*
JANGAN fullPage
*/

await page.screenshot({

path:"blibli.png",

timeout:20000

});

console.log(
"Screenshot berhasil"
);

await bot.sendPhoto(

chatId,

fs.createReadStream(
"./blibli.png"
),

{
caption:
"🔥 BLIBLI FLASHSALE"
}

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
