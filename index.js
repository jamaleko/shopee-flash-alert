const puppeteer = require("puppeteer");
const axios = require("axios");

const BOT_TOKEN = process.env.BOT_TOKEN;
const CHAT_ID = process.env.CHAT_ID;

async function kirimTelegram(text) {
try{

await axios.post(
`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
{
chat_id:CHAT_ID,
text:text
}
);

console.log("Telegram terkirim");

}catch(e){

console.log(
"Telegram gagal:",
e.message
);

}
}

async function run(){

let browser;

try{

browser=await puppeteer.launch({

headless:true,

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

"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36"

);

await page.setViewport({

width:1366,
height:768

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

// tunggu render
await new Promise(
r=>setTimeout(r,15000)
);

// scroll bertahap
for(let i=0;i<5;i++){

await page.evaluate(y=>{

window.scrollBy(
0,
y
);

},1000);

await new Promise(
r=>setTimeout(r,3000)
);

}

const title=await page.title();

console.log(
"Title:",
title
);

// ambil produk flashsale
const data=await page.evaluate(()=>{

let result=[];

const cards=document.querySelectorAll(
".els-fs-compact"
);

cards.forEach(card=>{

try{

const html=card.innerHTML;

const diskonMatch=
html.match(
/>(\d+)%</
);

if(
!diskonMatch
)return;

const diskon=parseInt(
diskonMatch[1]
);

if(
diskon<70
)return;

const harga=
card.innerText.match(
/Rp[\d\.]+/
)?.[0]||"";

if(
!harga
)return;

let link=
card.querySelector(
"a"
)?.href||"";

if(
link &&
!link.startsWith(
"http"
)
){

link=
"https://www.blibli.com"+
link;

}

result.push({

diskon,
harga,
link

});

}catch(e){}

});

return result;

});

console.log(
"Produk:",
data.length
);

if(
data.length===0
){

console.log(
"Tidak ada diskon >=70%"
);

}else{

for(
const item of data
){

const pesan=

`🔥 FLASH SALE BLIBLI 🔥

💸 Diskon : ${item.diskon}%

💰 Harga : ${item.harga}

🔗 ${item.link||"https://www.blibli.com/flashsale"}`;

console.log(
pesan
);

await kirimTelegram(
pesan
);

}

}

await browser.close();

}catch(e){

console.log(
"ERROR:",
e.message
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

await new Promise(
r=>setTimeout(
r,
300000
)
);

}

})();
