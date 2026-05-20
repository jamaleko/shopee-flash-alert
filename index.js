const { chromium } = require("playwright");
const TelegramBot = require("node-telegram-bot-api");

const bot = new TelegramBot(
process.env.BOT_TOKEN,
{polling:false}
);

const chatId=process.env.CHAT_ID;

async function sleep(ms){
return new Promise(resolve=>setTimeout(resolve,ms));
}

async function checkFlashsale(){

let browser;

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

console.log("Buka flashsale...");

await page.goto(
"https://www.blibli.com/flashsale",
{
waitUntil:"networkidle",
timeout:60000
}
);

await page.waitForTimeout(
10000
);

console.log(
"Title:",
await page.title()
);

/*
scroll beberapa kali
*/

for(let i=0;i<5;i++){

await page.mouse.wheel(
0,
2000
);

await page.waitForTimeout(
2000
);

}

/*
ambil semua text halaman
*/

const products=await page.evaluate(()=>{

const hasil=[];

/*
ambil elemen yang ada harga
*/

const semua=[
...document.querySelectorAll("*")
];

semua.forEach(el=>{

const text=
el.innerText?.trim();

if(!text) return;

/*
harus ada Rp
*/

if(
!text.match(/Rp[\d\.]+/)
){
return;
}

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
.map(x=>x.trim())
.filter(Boolean);

let harga="";
let nama="";

for(const line of lines){

if(
!harga &&
line.match(/Rp[\d\.]+/)
){
harga=line.match(
/Rp[\d\.]+/
)[0];
}

if(
!nama &&
!line.includes("Rp") &&
line.length>10
){
nama=line;
}

}

if(
!harga ||
!nama
){
return;
}

/*
cari link terdekat
*/

let parent=el;

for(let i=0;i<5;i++){

if(
parent.querySelector &&
parent.querySelector("a")
){

const a=
parent.querySelector("a");

if(
a.href
){

hasil.push({

nama:nama,
harga:harga,
link:a.href.split("?")[0]

});

break;

}

}

parent=
parent.parentElement;

if(!parent) break;

}

});

return [...new Map(

hasil.map(
x=>[
x.link,
x
]
)

).values()]
.slice(0,10);

});

console.log("");
console.log(
"=== FLASH SALE ==="
);

if(products.length===0){

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

await checkFlashsale();

console.log(
"Sleep 5 menit..."
);

await sleep(
300000
);

}

})();
