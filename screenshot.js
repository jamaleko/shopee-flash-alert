const { chromium } = require("playwright");

async function test(){

let browser;

try{

console.log("Token:",
process.env.BROWSERLESS_TOKEN?.slice(0,5));

console.log(
"Connect browserless..."
);

browser=
await chromium.connect(
`wss://production-sfo.browserless.io?token=${process.env.BROWSERLESS_TOKEN}`
);

console.log(
"Connected!"
);

const context=
await browser.newContext({

userAgent:
"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36",

viewport:{
width:1366,
height:768
},

locale:"id-ID",
timezoneId:"Asia/Jakarta"
});

console.log(
"Context dibuat"
);

const page=
await context.newPage();

console.log(
"Page dibuat"
);

await page.addInitScript(()=>{

Object.defineProperty(
navigator,
'webdriver',
{
get:()=>false
}
);

});

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

}
catch(e){

console.log(
"ERROR:",
e.message
);

}
finally{

if(browser){

console.log(
"Browser close"
);

await browser.close();

}

}

}

(async()=>{

await test();

})();
