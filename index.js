const puppeteer = require("puppeteer");
const axios = require("axios");

const BOT_TOKEN=process.env.BOT_TOKEN;
const CHAT_ID=process.env.CHAT_ID;

async function sleep(ms){

return new Promise(
r=>setTimeout(r,ms)
);

}

async function kirimTelegram(text){

try{

await axios.post(
`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
{
chat_id:CHAT_ID,
text:text
}
);

console.log(
"Telegram terkirim"
);

}catch(e){

console.log(
"Telegram error:",
e.message
);

}

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
"--disable-gpu"

]

});

const page=
await browser.newPage();

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

await sleep(
15000
);

// scroll ringan
for(let i=0;i<5;i++){

await page.evaluate((y)=>{

window.scrollBy(
0,
y
);

},1000);

await sleep(
3000
);

}

const produk=
await page.evaluate(()=>{

let hasil=[];

document
.querySelectorAll(
".els-fs-compact"
)
.forEach(card=>{

try{

const harga=
card.innerText.match(
/Rp[\d\.]+/
)?.[0];

if(
!harga
)return;

let link=
card.querySelector(
"a"
)?.href;

if(
!link
){

link=
"https://www.blibli.com/flashsale";

}

if(
!link.startsWith(
"http"
)
){

link=
"https://www.blibli.com"+
link;

}

hasil.push({

harga,
link

});

}catch(e){}

});

return hasil
.slice(0,10);

});

console.log(
"Produk ditemukan:",
produk.length
);

if(
produk.length===0
){

console.log(
"Tidak ada produk"
);

}else{

let pesan=
"🔥 FLASH SALE BLIBLI 🔥\n\n";

produk.forEach(
(x,i)=>{

pesan+=

`${i+1}. ${x.harga}

${x.link}

`;

});

await kirimTelegram(
pesan
);

}

await browser.close();

}catch(e){

console.log(
"ERROR:",
e.message
);

if(
browser
){

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
300000
);

}

})();
