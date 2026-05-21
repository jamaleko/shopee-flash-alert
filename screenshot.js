const { chromium } = require("playwright");

async function test(){

const browser=
await chromium.connect(

`wss://production-sfo.browserless.io?token=${process.env.BROWSERLESS_TOKEN}`

);

const page=
await browser.newPage();

console.log(
"Buka blibli..."
);

await page.goto(
"https://www.blibli.com/flashsale",
{
waitUntil:"networkidle",
timeout:120000
}
);

await page.waitForTimeout(
10000
);

console.log(
"Title:",
await page.title()
);

await page.screenshot({

path:"hasil.png"

});

console.log(
"Screenshot selesai"
);

await browser.close();

}

test();
