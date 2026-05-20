const puppeteer = require("puppeteer");
const axios = require("axios");

const BOT_TOKEN = process.env.BOT_TOKEN;
const CHAT_ID = process.env.CHAT_ID;

async function sendTelegram(msg){

try{

await axios.post(
`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
{
chat_id:CHAT_ID,
text:msg
}
);

console.log("Telegram terkirim");

}catch(err){

console.log(
"Telegram error:",
err.message
);

}

}

async function sleep(ms){

return new Promise(
r=>setTimeout(r,ms)
);

}

async function run(){

let browser;

try{

browser=await puppeteer.launch({

headless:true,

protocolTimeout:180000,

args:[

"--no-sandbox",
"--disable-setuid-sandbox",
"--disable-dev-shm-usage",
"--disable-gpu",
"--disable-blink-features=AutomationControlled"

]

});

const page=await browser.newPage();

await page.setUserAgent(
"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/136 Safari/537.36"
);

await page.setViewport({

width:375,
height:900

});

console.log(
"Buka flashsale..."
);

await page.goto(
"https://www.blibli.com/flashsale",
{
waitUntil:"domcontentloaded",
timeout:0
}
);

console.log(
"URL:",
page.url()
);

await sleep(15000);

// scroll ringan
await page.evaluate(()=>{

window.scrollTo(
0,
1000
);

});

await sleep(5000);

// ambil HTML saja (lebih ringan)
const html=await page.content();

console.log(
"HTML size:",
html.length
);

// regex diskon
const discountMatches=
[
...html.matchAll(
/>(\d+)%</g
)
];

const discounts=
discountMatches
.map(
x=>parseInt(x[1])
)
.filter(
x=>x>=70
);

console.log(
"Diskon ditemukan:",
discounts
);

if(
discounts.length===0
){

console.log(
"Tidak ada diskon >=70%"
);

}else{

for(
const d of discounts
){

const msg=

`🔥 FLASH SALE BLIBLI 🔥

💸 Diskon: ${d}%

🔗 https://www.blibli.com/flashsale`;

await sendTelegram(
msg
);

}

}

await browser.close();

}catch(err){

console.log(
"ERROR:",
err.message
);

if(browser){

await browser.close();

}

}

}

(async()=>{

while(true){

await run();

console.log(
"Sleep 60 detik..."
);

await sleep(
60000
);

}

})();
