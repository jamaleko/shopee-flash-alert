const { chromium } = require("playwright");

(async()=>{

const browser = await chromium.launch({
    headless:true,
    args:[
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-blink-features=AutomationControlled"
    ]
});

const context = await browser.newContext({
    userAgent:
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36",

    viewport:{
        width:1366,
        height:768
    },

    locale:"id-ID"
});

const page = await context.newPage();

await page.goto(
    "https://www.blibli.com",
    {
        waitUntil:"domcontentloaded",
        timeout:60000
    }
);

// sembunyikan webdriver
await page.addInitScript(()=>{
Object.defineProperty(
navigator,
'webdriver',
{
get:()=>false
});
});

console.log(
"Title:",
await page.title()
);

console.log("Done");

await browser.close();

})();
