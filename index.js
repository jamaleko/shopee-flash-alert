const { chromium } = require("playwright");

(async()=>{

const browser = await chromium.launch({
    headless:true
});

const page = await browser.newPage();

await page.goto(
    "https://www.blibli.com",
    {
        waitUntil:"domcontentloaded"
    }
);

await page.waitForTimeout(5000);

await page.screenshot({
    path:"debug.png",
    fullPage:true
});

console.log(
    await page.title()
);

await browser.close();

})();
