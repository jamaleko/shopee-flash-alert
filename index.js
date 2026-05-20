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

async function screenshotBlibli(){

let browser=null;

try{

browser =
await chromium.launch({

headless:true,

args:[
"--no-sandbox",
"--disable-setuid-sandbox",
"--disable-dev-shm-usage"
]

});

const page =
await browser.newPage({

viewport:{
width:1366,
height:2200
}

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

await page.waitForTimeout(
15000
);

/*
scroll sedikit
*/

await page.mouse.wheel(
0,
1500
);

await page.waitForTimeout(
5000
);

console.log(
"Ambil screenshot..."
);

await page.screenshot({

path:"blibli.png",
fullPage:true

});

console.log(
"Screenshot berhasil"
);

/*
kirim telegram
*/

await bot.sendPhoto(

chatId,

fs.createReadStream(
"./blibli.png"
),

{

caption:
"🔥 Screenshot Blibli Flashsale"

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

await screenshotBlibli();

console.log(
"Sleep 5 menit..."
);

await sleep(
300000
);

}

})();
