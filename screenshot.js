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

proxy:{

server:
process.env.PROXY_SERVER,

username:
process.env.PROXY_USER,

password:
process.env.PROXY_PASS

},

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
"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/136.0 Safari/537.36"

});

console.log(
"Buka blibli..."
);

await page.goto(

"https://www.blibli.com/flashsale",

{

waitUntil:"domcontentloaded",
timeout:60000

}

);

await page.waitForTimeout(
10000
);

const body=
await page.locator(
"body"
).textContent();

console.log(
body.substring(0,500)
);

await bot.sendMessage(

chatId,

body.substring(0,3000)

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
