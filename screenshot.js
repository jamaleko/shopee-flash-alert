const { chromium } = require("playwright");

(async()=>{

const browser=
await chromium.launch({
headless:true
});

const page=
await browser.newPage();

page.on(
"response",
async(res)=>{

const url=res.url();

if(
url.includes("api")||
url.includes("flash")||
url.includes("product")
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
"https://www.blibli.com/flashsale",
{
waitUntil:"domcontentloaded"
}
);

await page.waitForTimeout(
30000
);

await browser.close();

})();
