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

browser =
await chromium.launch({

headless:true,

args:[

"--no-sandbox",
"--disable-setuid-sandbox",
"--disable-dev-shm-usage",
"--disable-gpu"

]

});

const page =
await browser.newPage({

viewport:{
width:1280,
height:720
},

userAgent:
"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0 Safari/537.36"

});

/*
SIMPAN HASIL API
*/

let apiProducts=[];

/*
TANGKAP RESPONSE API
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

const headers=
response.headers();

const contentType=
headers["content-type"] || "";

if(
contentType.includes("application/json")
){

const json=
await response.json();

/*
cari array product
*/

const text=
JSON.stringify(json);

/*
ambil semua nama + harga dari json
*/

const namaRegex=
/"name":"(.*?)"/g;

const hargaRegex=
/"price":"?(.*?)"?[,}]/g;

let names=[];
let prices=[];

let m;

/*
nama
*/

while(
(m=namaRegex.exec(text)) !== null
){

names.push(
m[1]
);

}

/*
harga
*/

while(
(m=hargaRegex.exec(text)) !== null
){

prices.push(
m[1]
);

}

/*
gabung
*/

for(let i=0;i<names.length;i++){

const nama=
names[i];

const harga=
prices[i] || "-";

if(

nama &&
nama.length > 5

){

apiProducts.push({

nama,

harga

});

}

}

}

}

}catch(e){

}

});

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
"Halaman terbuka"
);

/*
biarkan API jalan
*/

await page.waitForTimeout(
15000
);

/*
hapus duplikat
*/

const products=[

...new Map(

apiProducts.map(
x=>[
x.nama,
x
]
)

).values()

]

.slice(0,10);

console.log("");
console.log(
"=== FLASH SALE ==="
);

console.log(
"Jumlah produk:",
products.length
);

if(
products.length===0
){

console.log(
"Tidak ada produk ditemukan"
);

}else{

let pesan=
"🔥 FLASH SALE BLIBLI 🔥\n\n";

products.forEach(item=>{

console.log(
item.nama
);

console.log(
item.harga
);

console.log(
"-------------"
);

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

await run();

console.log(
"Sleep 5 menit..."
);

await sleep(
300000
);

}

})();
