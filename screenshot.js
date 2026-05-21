const { chromium } = require("playwright");

async function sleep(ms){
return new Promise(
r=>setTimeout(r,ms)
);
}

async function test(){

let browser;

try{

browser=
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
