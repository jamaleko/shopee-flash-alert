const { chromium } = require("playwright");
const TelegramBot = require("node-telegram-bot-api");

const bot=new TelegramBot(
process.env.BOT_TOKEN,
{
polling:false
}
);

const chatId=process.env.CHAT_ID;

async function sleep(ms){

return new Promise(resolve=>{

setTimeout(resolve,ms);

});

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

console.log(
"Buka flashsale..."
);

await page.goto(

"https://www.blibli.com/flashsale",

{
waitUntil:"domcontentloaded",
timeout:60000
}

);

await page.waitForTimeout(
15000
);

console.log(
"Title:",
await page.title()
);

const debug = await page.evaluate(()=>{

const cards=document.querySelectorAll(
'a[href*="/p/"]'
);

return [...cards]
.slice(0,3)
.map(x=>x.innerHTML);

});

console.log(
JSON.stringify(debug,null,2)
);

await browser.close();

}catch(err){

console.log(
"ERROR:",
err.message
);

if(
browser
){

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
