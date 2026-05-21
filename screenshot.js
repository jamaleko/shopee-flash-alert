const { chromium } = require("playwright");

(async()=>{

let browser;

try{

console.log("Connect...");

browser=
await chromium.connectOverCDP(
`wss://production-sfo.browserless.io?token=${process.env.BROWSERLESS_TOKEN}`
);

console.log(
"CONNECTED OK"
);

const page=
await browser.newPage();

page.on(
"response",
res=>{

if(
res.url().includes(
"blibli"
)
){

console.log(
"API:",
res.status(),
res.url()
);

}

}
);

console.log(
"Buka blibli..."
);

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

console.log(
"Closed"
);

}

}

})();
