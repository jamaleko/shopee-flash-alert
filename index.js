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
"--single-process"
]

});

const page =
await browser.newPage({

viewport:{
width:1280,
height:720
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
"Ambil screenshot ringan..."
);

/*
SUPER RINGAN
hanya area kecil
*/

await page.screenshot({

path:"blibli.png",

clip:{
x:0,
y:0,
width:1280,
height:720
}

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
