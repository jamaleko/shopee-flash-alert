const { chromium } = require("playwright-extra");

const stealth =
require("puppeteer-extra-plugin-stealth")();

chromium.use(
stealth
);

const TelegramBot =
require("node-telegram-bot-api");

const bot =
new TelegramBot(
process.env.BOT_TOKEN,
{ polling:false }
);

const chatId =
process.env.CHAT_ID;

async function sleep(ms){

return new Promise(
r=>setTimeout(r,ms)
);

}

async function checkFlashsale(){

let browser=null;

try{

browser =
await chromium.launch({

headless:true,

args:[
"--no-sandbox",
"--disable-setuid-sandbox",
"--disable-dev-shm-usage"
]

});

const page =
await browser.newPage({

viewport:{
width:1366,
height:768
}

});

await page.setExtraHTTPHeaders({

"accept-language":
"id-ID,id;q=0.9"

});

console.log(
"Buka flashsale..."
);

await page.goto(
"https://www.blibli.com/flashsale",
{
waitUntil:"networkidle",
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
scroll kecil
*/

await page.mouse.wheel(
0,
1200
);

await page.waitForTimeout(
5000
);

console.log(
"Title:",
await page.title()
);

/*
cek body
*/

const body =
await page.locator("body")
.innerText();

console.log(
"BODY LENGTH:",
body.length
);

/*
ambil semua harga
*/

const products =
await page.evaluate(()=>{

const hasil=[];

const semua =
[
...document.querySelectorAll("*")
];

semua.forEach(el=>{

const text =
el.innerText?.trim();

if(!text) return;

if(
!text.match(
/Rp[\d\.]+/
)
)
return;

if(
text.length > 300
)
return;

const harga =
text.match(
/Rp[\d\.]+/
)?.[0];

if(!harga)
return;

const lines =
text
.split("\n")
.map(x=>x.trim())
.filter(Boolean);

let nama="Produk";

for(const line of lines){

if(

!line.includes("Rp") &&
line.length > 5

){

nama=line;
break;

}

}

hasil.push({

nama,
harga

});

});

return hasil.slice(0,10);

});

console.log(
"Jumlah produk:",
products.length
);

if(
products.length===0
){

console.log(
"Tidak ada produk"
);

}else{

let pesan =
"🔥 FLASH SALE BLIBLI 🔥\n\n";

products.forEach(item=>{

pesan +=

`📦 ${item.nama}

💰 ${item.harga}

`;

});

await bot.sendMessage(
chatId,
pesan
);

console.log(
"Telegram terkirim"
);

}

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
