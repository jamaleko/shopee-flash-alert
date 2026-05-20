const { chromium } = require("playwright");
const TelegramBot = require("node-telegram-bot-api");

const bot = new TelegramBot(
process.env.BOT_TOKEN,
{ polling:false }
);

const chatId=process.env.CHAT_ID;

async function sleep(ms){
return new Promise(
resolve=>setTimeout(resolve,ms)
);
}

async function checkFlashsale(){

let browser=null;

try{

browser=await chromium.launch({

headless:true,

args:[
"--no-sandbox",
"--disable-setuid-sandbox",
"--disable-dev-shm-usage",
"--disable-blink-features=AutomationControlled"
]

});

const page=await browser.newPage({

viewport:{
width:1366,
height:768
},

userAgent:
"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0 Safari/537.36"

});

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

console.log(
"Title:",
await page.title()
);

/*
scroll supaya card muncul
*/

for(let i=0;i<8;i++){

await page.mouse.wheel(
0,
2000
);

await page.waitForTimeout(
3000
);

}

/*
ambil produk
*/

const products=
await page.evaluate(()=>{

const hasil=[];

const cards=[

...document.querySelectorAll(
'a[href*="/p/"]'
)

];

console.log(
"Jumlah card:",
cards.length
);

cards.forEach(card=>{

const text=
card.innerText?.trim();

if(!text) return;

/*
buang sampah
*/

if(

text.includes("Masuk")||
text.includes("Daftar")||
text.includes("Kategori")||
text.includes("Berlangsung")||
text.includes("Besok")||
text.includes("Peringat")||
text.includes("Akan hadir")

){
return;
}

const lines=text
.split("\n")
.map(
x=>x.trim()
)
.filter(Boolean);

let nama="";
let harga="";

/*
ambil harga
*/

for(const line of lines){

const m=
line.match(
/Rp[\d\.]+/
);

if(m){

harga=m[0];
break;

}

}

/*
ambil nama
*/

for(const line of lines){

if(

!line.includes("Rp")&&
line.length>10&&
!line.includes("Beli sekarang")&&
!line.includes("Cepat habis")

){

nama=line;
break;

}

}

if(
!nama||
!harga
){
return;
}

hasil.push({

nama,
harga,

link:
card.href
.split("?")[0]

});

});

return [

...new Map(

hasil.map(
x=>[
x.link,
x
]
)

).values()

]

.slice(0,10);

});

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
"Nama:",
item.nama
);

console.log(
"Harga:",
item.harga
);

console.log(
"Link:",
item.link
);

console.log(
"----------------"
);

pesan+=

`📦 ${item.nama}

💰 ${item.harga}

🔗 ${item.link}

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
