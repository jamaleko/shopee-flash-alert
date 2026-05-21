const { chromium } = require("playwright");
const TelegramBot = require("node-telegram-bot-api");

const bot = new TelegramBot(
process.env.BOT_TOKEN,
{ polling:false }
);

const chatId=
process.env.CHAT_ID;

(async()=>{

let browser;

try{

browser=
await chromium.launch({

headless:true,

args:[

"--no-sandbox",
"--disable-setuid-sandbox",
"--disable-dev-shm-usage",
"--disable-gpu"

]

});

const page=
await browser.newPage({

viewport:{

width:800,
height:600

}

});

console.log(
"Buka halaman..."
);

await page.goto(

"https://www.tokopedia.com/discovery/deals",

{

waitUntil:"domcontentloaded",
timeout:60000

}

);

console.log(
"Halaman terbuka"
);

await page.waitForTimeout(
3000
);

console.log(
"Ambil screenshot..."
);

/*
pakai CDP langsung
bukan page.screenshot()
*/

const client=
await page.context()
.newCDPSession(page);

const result=
await client.send(
"Page.captureScreenshot",
{

format:"png"

}
);

const buffer=
Buffer.from(
result.data,
"base64"
);

console.log(
"Kirim telegram..."
);

await bot.sendPhoto(

chatId,

buffer,

{

caption:
"📸 Screenshot test"

}

);

console.log(
"Selesai"

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

})();
