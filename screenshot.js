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
await chromium.connectOverCDP(
`wss://production-sfo.browserless.io?token=${process.env.BROWSERLESS_TOKEN}`
);

console.log(
"Connected!"
);

/*
ambil browser context pertama
*/

const contexts=
browser.contexts();

let context;

if(contexts.length>0){

context=
contexts[0];

}else{

context=
await browser.newContext();

}

const page=
await context.newPage();

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

console.log(
"Title:",
await page.title()
);

console.log(
"Screenshot..."
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
"ERROR:"
);

console.log(
e.message
);

if(e.stack){

console.log(
e.stack
);

}

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
