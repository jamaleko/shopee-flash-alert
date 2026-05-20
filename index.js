const { chromium } = require("playwright");
const TelegramBot = require("node-telegram-bot-api");

const bot = new TelegramBot(
process.env.BOT_TOKEN,
{ polling:false }
);

const chatId=
process.env.CHAT_ID;

async function sleep(ms){

return new Promise(
r=>setTimeout(r,ms)
);

}

async function checkFlashsale(){

let browser=null;

try{

browser=
await chromium.launch({

headless:true,

args:[
"--no-sandbox",
"--disable-setuid-sandbox",
"--disable-dev-shm-usage",
"--disable-blink-features=AutomationControlled"
]

});

const page=
await browser.newPage({

viewport:{
width:1366,
height:768
},

userAgent:
"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"

});

/*
LOG SEMUA REQUEST
*/

page.on(
"request",
req=>{

console.log(
"[REQ]",
req.method(),
req.url()
);

}
);

/*
LOG SEMUA RESPONSE
*/

page.on(
"response",
async(res)=>{

try{

const url=
res.url();

const type=
res.headers()["content-type"]||"";

console.log(
"[RES]",
res.status(),
url
);

/*
cek json
*/

if(
type.includes(
"application/json"
)
){

console.log(
"[JSON]",
url
);

}

}catch(e){}

}
);

console.log(
"Buka flashsale..."
);

await page.goto(
"https://www.blibli.com/flashsale",
{
waitUntil:"domcontentloaded",
timeout:90000
}
);

console.log(
"Halaman terbuka"
);

await page.waitForTimeout(
15000
);

/*
scroll panjang
*/

for(
let i=0;
i<10;
i++
){

await page.mouse.wheel(
0,
3000
);

console.log(
"Scroll:",
i+1
);

await page.waitForTimeout(
3000
);

}

console.log(
"Title:",
await page.title()
);

/*
ambil isi html sedikit
*/

const html=
await page.content();

console.log(
"HTML length:",
html.length
);

/*
cek ada Rp atau tidak
*/

const bodyText=
await page.evaluate(
()=>document.body.innerText
);

console.log(
"ADA RP:",
bodyText.includes("Rp")
);

console.log(
"CONTOH TEXT:"
);

console.log(
bodyText
.substring(0,3000)
);

}catch(err){

console.log(
"ERROR:",
err.message
);

}finally{

if(browser){

await browser.close();

}

}

}

(async()=>{

while(true){

await checkFlashsale();

console.log(
"Sleep 5 menit..."
);

await sleep(
300000
);

}

})();
