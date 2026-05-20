const { chromium } = require("playwright");

(async()=>{

const browser = await chromium.launch({
    headless:true,
    args:[
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage"
    ]
});

const page = await browser.newPage();

await page.goto(
    "https://www.blibli.com",
    {
        waitUntil:"domcontentloaded",
        timeout:60000
    }
);

console.log(
    "Title:",
    await page.title()
);

// ambil HTML langsung, lebih ringan
const html = await page.content();

console.log(
    html.substring(0,500)
);

await browser.close();

console.log("Done");

})();
