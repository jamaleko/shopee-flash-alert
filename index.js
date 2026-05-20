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

/*
scroll dikit
*/

await page.mouse.wheel(
0,
1000
);

await page.waitForTimeout(
3000
);

/*
ambil text langsung dari halaman
BUKAN a[href]
karena Blibli virtual render
*/

const products=
await page.evaluate(()=>{

const hasil=[];

const semua=
[
...document.querySelectorAll("*")
];

semua.forEach(el=>{

const text=
el.innerText?.trim();

if(
!text
)
return;

/*
harus ada harga
*/

if(
!text.match(
/Rp[\d\.]+/
)
)
return;

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

const lines=
text
.split("\n")
.map(
x=>x.trim()
)
.filter(Boolean);

let harga="";
let nama="";

/*
harga
*/

for(
const line of lines
){

const m=
line.match(
/Rp[\d\.]+/
);

if(
m
){

harga=
m[0];

break;

}

}

/*
nama
*/

for(
const line of lines
){

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
)
return;

/*
cari link parent
*/

let parent=
el;

let link="";

for(
let i=0;
i<10;
i++
){

if(
!parent
)
break;

const a=
parent.querySelector?.(
"a[href]"
);

if(
a &&
a.href
){

link=
a.href.split("?")[0];

break;

}

parent=
parent.parentElement;

}

hasil.push({

nama,
harga,
link

});

});

/*
hapus duplikat
*/

return [
...new Map(

hasil.map(
x=>[
x.nama,
x
]
)

).values()

]

.slice(
0,
10
);

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

products.forEach(
item=>{

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

🔗 ${item.link||"-"}

`;

}
);

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
