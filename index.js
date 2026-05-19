const { chromium } = require("playwright");
const TelegramBot = require("node-telegram-bot-api");

const bot = new TelegramBot(
    process.env.BOT_TOKEN
);

const chatId = process.env.CHAT_ID;

(async()=>{

const browser = await chromium.launch({
    headless:true
});

const page = await browser.newPage();

await page.goto(
    "https://shopee.co.id/flash_sale",
    {
        waitUntil:"networkidle"
    }
);

await page.waitForTimeout(5000);

const products = await page.evaluate(()=>{

const items=[];

document
.querySelectorAll(
'.shopee-search-item-result__item'
)
.forEach(x=>{

const name=
x.innerText || "";

items.push({
name
});

});

return items;

});

console.log(products);

for(let p of products){

await bot.sendMessage(
chatId,
`🔥 ${p.name}`
);

}

await browser.close();

})();
