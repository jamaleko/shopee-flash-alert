const { chromium } = require("playwright");
const TelegramBot = require("node-telegram-bot-api");

const bot = new TelegramBot(
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

async function run(){

let browser;

try{

browser=
await chromium.launch({

headless:true,

args:[

"--no-sandbox",
"--disable-setuid-sandbox",
"--disable-dev-shm-usage"

]

});

const context=
await browser.newContext({

viewport:{
width:1366,
height:768
},

userAgent:
"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0 Safari/537.36"

});

const page=
await context.newPage();

let products=[];

/*
tangkap response API
dari browser asli
*/

page.on(
"response",
async(response)=>{

try{

const url=
response.url();

if(

url.includes("flashsale") ||
url.includes("product") ||
url.includes("search")

){

console.log(
"API:",
url
);

const json=
await response.json()
.catch(()=>null);

if(!json) return;

const text=
JSON.stringify(json);

const harga=
text.match(
/Rp[\d\.]+/g
);

if(
harga
){

products.push({

nama:
url.slice(
0,
80
),

harga:
harga[0],

link:url

});

}

}

}catch(e){}

}
);

console.log(
"Buka blibli..."
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
20000
);

console.log(
"Jumlah produk:",
products.length
);

products=[

...new Map(

products.map(
x=>[
x.link,
x
]
)

).values()

]

.slice(0,10);

console.log(
"=== FLASH SALE ==="
);

if(
products.length===0
){

console.log(
"Tidak ada produk ditemukan"
);

return;

}

let pesan=
"🔥 FLASH SALE BLIBLI 🔥\n\n";

for(const item of products){

console.log(
item.harga
);

pesan+=

`💰 ${item.harga}

🔗 ${item.link}

`;

}

await bot.sendMessage(
chatId,
pesan
);

console.log(
"Telegram terkirim"
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

await run();

console.log(
"Sleep 5 menit..."
);

await sleep(
300000
);

}

})();
