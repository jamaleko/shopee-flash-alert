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
"--disable-features=site-per-process",
"--font-render-hinting=none"

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
BLOCK SEMUA YANG BERAT
*/

await page.route("**/*",async route=>{

const type =
route.request().resourceType();

if(

type==="font" ||
type==="image" ||
type==="media" ||
type==="stylesheet"

){

await route.abort();

}else{

await route.continue();

}

});

console.log(
"Buka blibli..."
);

await page.goto(
"https://shopee.co.id/flash_sale",
{
waitUntil:"domcontentloaded",
timeout:120000
}
);

console.log(
"Halaman terbuka"
);

/*
STOP LOAD TOTAL
supaya chromium berhenti render
*/

await page.evaluate(()=>{

window.stop();

});

/*
hapus semua style
*/

await page.evaluate(()=>{

const styles =
document.querySelectorAll(
'style,link[rel="stylesheet"]'
);

styles.forEach(
x=>x.remove()
);

});

/*
jangan tunggu lama
*/

await page.waitForTimeout(
2000
);

console.log(
"Screenshot..."
);

/*
PAKSA SCREENSHOT CEPAT
*/

await page.screenshot({

path:"blibli.png",

type:"png",

animations:"disabled",

caret:"hide",

scale:"css",

timeout:5000

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
"🔥 BLIBLI"
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
