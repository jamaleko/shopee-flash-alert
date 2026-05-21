const { chromium } = require("playwright");

async function test(){

let browser;

try{

console.log("Connect browserless...");

browser=await chromium.connect(
`wss://production-sfo.browserless.io?token=${process.env.BROWSERLESS_TOKEN}`
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

const page=
await context.newPage();

await page.addInitScript(()=>{

Object.defineProperty(
navigator,
"webdriver",
{
get:()=>false
}
);

Object.defineProperty(
navigator,
"platform",
{
get:()=> "Win32"
}
);

Object.defineProperty(
navigator,
"languages",
{
get:()=>["id-ID","id"]
}
);

});

page.on(
"response",
r=>{

if(
r.url().includes(
"flashsale"
)
){

console.log(
"API:",
r.status(),
r.url()
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

console.log(
"Menunggu..."
);

await page.waitForTimeout(
15000
);

console.log(
"Title:",
await page.title()
);

await page.screenshot({
path:"hasil.png"
});

console.log(
"Selesai"
);

}catch(e){

console.log(
"ERROR:",
e.message
);

}finally{

if(browser){

await browser.close();

}

}

}

test();
