const { chromium } = require("playwright");

async function sleep(ms){
return new Promise(
r=>setTimeout(r,ms)
);
}

async function test(){

let browser=null;

try{

console.log(
"Token:",
process.env.BROWSERLESS_TOKEN
? "ADA"
: "KOSONG"
);

console.log(
"Connect browserless..."
);

browser=
await chromium.connect(
`wss://production-sfo.browserless.io?token=${process.env.BROWSERLESS_TOKEN}`
);

console.log(
"Browser connected"
);

const page=
await browser.newPage();

console.log(
"Buka blibli..."
);

const response=
await page.goto(
"https://www.blibli.com/flashsale",
{
waitUntil:"domcontentloaded",
timeout:120000
}
);

console.log(
"Status:",
response?.status()
);

console.log(
"Tunggu render..."
);

await page.waitForTimeout(
15000
);

const title=
await page.title();

console.log(
"Title:",
title
);

console.log(
"Screenshot..."
);

await page.screenshot({
path:"hasil.png"
});

console.log(
"Selesai screenshot"
);

}catch(e){

console.log(
"ERROR:"
);

console.log(
e.message
);

console.log(
e.stack
);

}finally{

if(browser){

await browser.close();

console.log(
"Browser close"
);

}

}

}

(async()=>{

while(true){

await test();

console.log(
"Tunggu 5 menit..."
);

await sleep(
300000
);

}

})();
