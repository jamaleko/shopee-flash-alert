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
"--disable-gpu",
"--disable-web-security",
"--disable-features=IsolateOrigins,site-per-process",
"--blink-settings=imagesEnabled=false"

]

});

const page =
await browser.newPage({

viewport:{
width:1280,
height:720
}

});

/*
MATIKAN SEMUA ASSET BERAT
*/

await page.route("**/*",route=>{

const type=
route.request().resourceType();

if(

type==="image"||
type==="font"||
type==="media"||
type==="stylesheet"

){

route.abort();

}else{

route.continue();

}

});

console.log(
"Buka blibli..."
);

await page.goto(
"https://www.blibli.com/flashsale",
{
waitUntil:"domcontentloaded",
timeout:120000
}
);

console.log(
"Halaman terbuka"
);

await page.waitForTimeout(
5000
);

console.log(
"Screenshot..."
);

await page.screenshot({

path:"blibli.png",

timeout:10000

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
"🔥 BLIBLI LIGHT MODE"
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
