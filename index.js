const { chromium } = require("playwright");
const TelegramBot = require("node-telegram-bot-api");
const fs = require("fs");

const bot = new TelegramBot(
    process.env.BOT_TOKEN
);

const chatId = process.env.CHAT_ID;

(async()=>{

try{

console.log("Start bot...");

const browser = await chromium.launch({
    headless:true
});

const page = await browser.newPage({

userAgent:
"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124.0 Safari/537.36"

});

console.log("Buka Blibli");

await page.goto(
"https://www.blibli.com/flashsale",
{
    waitUntil:"networkidle",
    timeout:60000
}
);

await page.waitForTimeout(10000);

console.log(
"Title:",
await page.title()
);

await page.screenshot({
    path:"debug.png",
    fullPage:true
});

console.log("Screenshot dibuat");
await bot.sendPhoto(
    chatId,
    "debug.png",
    {
        caption:"📷 Screenshot hasil Playwright"
    }
);

const products = await page.evaluate(()=>{

const items=[];

document
.querySelectorAll("div")
.forEach(x=>{

const text=x.innerText?.trim();

if(
text &&
text.includes("Rp") &&
text.length>20 &&
text.length<150
){

items.push(text);

}

});

return [...new Set(items)]
.slice(0,10);

});

console.log(products);

if(products.length===0){

await bot.sendMessage(
chatId,
"⚠ Tidak menemukan produk"
);

}else{

let msg=
"🔥 Produk ditemukan:\n\n";

products.forEach((x,i)=>{

msg +=
`${i+1}. ${x}\n\n`;

});

await bot.sendMessage(
chatId,
msg
);

}

await browser.close();

}catch(err){

console.log(
"ERROR:"
);

console.log(
err.stack
);

try{

await bot.sendMessage(
chatId,
"❌ ERROR:\n"+err.message
);

}catch{}

}

})();
