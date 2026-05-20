const { chromium } = require("playwright");
const TelegramBot = require("node-telegram-bot-api");

const bot=new TelegramBot(
process.env.BOT_TOKEN,
{polling:false}
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
"--disable-dev-shm-usage"
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
scroll pelan
*/

for(let i=0;i<10;i++){

await page.mouse.wheel(
0,
1000
);

await page.waitForTimeout(
3000
);

}

const products=
await page.evaluate(()=>{

const hasil=[];

/*
ambil semua card yang terlihat
*/

const semua=
[
...document.querySelectorAll(
"div"
)
];

semua.forEach(card=>{

const txt=
card.innerText?.trim();

if(!txt) return;

/*
harus ada harga
*/

if(
!txt.match(/Rp[\d\.]+/)
){
return;
}

/*
buang menu
*/

if(

txt.includes("Masuk")||
txt.includes("Daftar")||
txt.includes("Kategori")||
txt.includes("Berlangsung")||
txt.includes("Besok")||
txt.includes("Peringat")||
txt.includes("Akan hadir")||
txt.includes("Filter")

){
return;
}

const lines=
txt
.split("\n")
.map(
x=>x.trim()
)
.filter(Boolean);

let nama="";
let harga="";

for(
const line of lines
){

if(

!nama&&
!line.includes("Rp")&&
line.length>8&&
!line.includes("Cepat habis")&&
!line.includes("Beli sekarang")

){

nama=line;

}

const m=
line.match(
/Rp[\d\.]+/
);

if(
m&&!harga
){

harga=m[0];

}

}

if(
!nama||
!harga
){
return;
}

/*
cari link parent
*/

let parent=
card;

let link="";

for(
let i=0;
i<15;
i++
){

if(
!parent
) break;

const a=
parent.querySelector(
"a[href]"
);

if(
a&&a.href
){

link=
a.href
.split("?")[0];

break;

}

parent=
parent.parentElement;

}

if(
!link
){
return;
}

hasil.push({

nama,
harga,
link

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

return;

}

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
item.link
);

console.log(
"-------------"
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

}catch(err){

console.log(
"ERROR:",
err.message
);

}finally{

if(
browser
){

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
