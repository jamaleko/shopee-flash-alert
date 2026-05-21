const { chromium } = require("playwright-extra");
const StealthPlugin =
require("puppeteer-extra-plugin-stealth");

chromium.use(
StealthPlugin()
);

(async()=>{

let browser;

try{

browser=
await chromium.connect(
`wss://production-sfo.browserless.io?token=${process.env.BROWSERLESS_TOKEN}`
);

console.log(
"CONNECTED"
);

const page=
await browser.newPage();

await page.goto(
"https://www.blibli.com/flashsale",
{
waitUntil:"domcontentloaded",
timeout:120000
}
);

await page.waitForTimeout(
15000
);

console.log(
"Title:",
await page.title()
);

await page.screenshot({
path:"hasil.png",
fullPage:true
});

console.log(
"Screenshot selesai"
);

}catch(e){

console.log(
"ERROR:",
e.message
);

}
finally{

if(browser){
await browser.close();
}

}

})();
