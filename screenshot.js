const { chromium } = require("playwright");
const TelegramBot = require("node-telegram-bot-api");

const bot=new TelegramBot(
process.env.BOT_TOKEN,
{polling:false}
);

const chatId=
process.env.CHAT_ID;

(async()=>{

let browser;

try{

browser=
await chromium.launch({

headless:true,

proxy:{

server:
process.env.PROXY_SERVER,

username:
process.env.PROXY_USER,

password:
process.env.PROXY_PASS

},

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
"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/136.0 Safari/537.36"

});

console.log(
"Buka blibli..."
);

await page.goto(

"https://www.blibli.com/flashsale",

{

waitUntil:"domcontentloaded",
timeout:60000

}

);

console.log(
"Halaman terbuka"
);

/*
scroll kecil supaya lazy load jalan
*/

for(let i=0;i<3;i++){

await page.mouse.wheel(
0,
1000
);

await page.waitForTimeout(
3000
);

}

/*
tunggu maksimal 60 detik
sampai skeleton hilang
*/

for(let i=0;i<12;i++){

const body=
await page.evaluate(
()=>document.body.innerText
);

console.log(
"Cek:",
i
);

if(

body.includes("Rp")
  
){

console.log(
"Produk muncul!"
);

break;

}

await page.waitForTimeout(
5000
);

}

/*
screenshot akhir
*/

await page.screenshot({

path:"hasil.png",

timeout:0

});

await bot.sendPhoto(

chatId,

"hasil.png",

{

caption:
"Hasil cek produk"

}

);

console.log(
"Selesai"
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

})();
