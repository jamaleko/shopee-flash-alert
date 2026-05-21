const { chromium } = require("playwright");

(async()=>{

const browser=
await chromium.connectOverCDP(
`wss://production-sfo.browserless.io?token=${process.env.BROWSERLESS_TOKEN}`
);

const page=
await browser.newPage();

page.on(
"response",
async(res)=>{

const url=res.url();

if(
url.includes("blibli")
){

console.log(
"API:",
res.status(),
url
);

}

}
);

await page.goto(
"https://www.blibli.com/flashsale"
);

await page.waitForTimeout(
15000
);

await browser.close();

})();
