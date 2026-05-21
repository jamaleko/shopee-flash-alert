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
"--disable-dev-shm-usage"

]

});

const page=
await browser.newPage({

viewport:{

width:1366,
height:768

},

userAgent:
"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0 Safari/537.36"

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
10000
);

console.log(
"Ambil screenshot..."
);

const img=

await page.screenshot({

type:"png",

fullPage:false,

animations:"disabled",

timeout:5000

});

console.log(
"Kirim telegram..."
);

await bot.sendPhoto(

chatId,

img,

{

caption:
"📸 Screenshot Tokopedia"

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
