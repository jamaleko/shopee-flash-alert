const { chromium } = require("playwright");
const TelegramBot = require("node-telegram-bot-api");

const bot=new TelegramBot(
process.env.BOT_TOKEN,
{polling:false}
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
}

});

/*
log request gagal
*/

page.on(
"requestfailed",
req=>{

console.log(
"FAILED:",
req.url(),
req.failure()?.errorText
);

}
);

page.on(
"response",
res=>{

if(
res.status()>=400
){

console.log(
"STATUS:",
res.status(),
res.url()
);

}

}
);

console.log(
"Buka..."
);

await page.goto(

"https://www.blibli.com/flashsale",

{

waitUntil:"domcontentloaded",
timeout:60000

}

);

console.log(
"Menunggu..."
);

await page.waitForTimeout(
15000
);

await page.screenshot({

path:"hasil.png"

});

await bot.sendPhoto(

chatId,

"hasil.png",

{

caption:
"debug"

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
