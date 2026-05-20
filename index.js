const puppeteer=require("puppeteer");
const axios=require("axios");

const BOT_TOKEN=process.env.BOT_TOKEN;
const CHAT_ID=process.env.CHAT_ID;

const sentProducts=new Set();

async function sendTelegram(message){

try{

await axios.post(
`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
{
chat_id:CHAT_ID,
text:message
}
);

console.log(
"Telegram terkirim"
);

}catch(err){

console.log(
"Telegram error:",
err.message
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
"--disable-web-security"

]

});

const page=
await browser.newPage();

await page.setViewport({

width:1366,
height:768

});

await page.setUserAgent(

"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136 Safari/537.36"

);



// hemat RAM Northflank
await page.setRequestInterception(
true
);

page.on(
"request",
(req)=>{

const type=
req.resourceType();

if(

type==="image" ||
type==="font" ||
type==="media"

){

req.abort();

}else{

req.continue();

}

}
);


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


await page.waitForSelector(

".els-fs-compact",

{

timeout:30000

}

);


await page.waitForTimeout(
10000
);


console.log(
"Title:",
await page.title()
);



const products=
await page.evaluate(()=>{

const result=[];

const cards=
document.querySelectorAll(
".els-fs-compact"
);


cards.forEach(card=>{

try{


// harga

const priceEl=
card.querySelector(
".els-fs-compact__price span:last-child"
);

const price=
priceEl?.innerText
?.trim()
||"";



// diskon

const discountEl=
card.querySelector(
".els-ribbon__content span"
);

const discountText=
discountEl?.innerText
||"0";

const discount=
parseInt(
discountText.replace(/\D/g,"")
)
||0;



// link

let link=
"https://www.blibli.com/flashsale";

const a=
card.closest("a");

if(
a &&
a.href
){

link=a.href;

}



// nama

let name=
card.innerText
.split("\n")
.find(x=>

x &&
!x.includes("Rp") &&
!x.includes("%") &&
!x.includes("Beli sekarang")

);

if(
!name
){

name=
"Produk Flash Sale";

}



// hanya diskon >=70%

if(

discount>=70 &&
price

){

result.push({

name,
price:"Rp"+price,
discount,
link

});

}

}catch(e){}

});


return result;

});



console.log(
"\n=== DISKON >=70% ==="
);


if(
products.length===0
){

console.log(
"Tidak ada diskon >=70%"
);

}else{


for(
const p of products
){

const key=

p.price+
p.discount+
p.link;


if(
sentProducts.has(
key
)
){

continue;

}


sentProducts.add(
key
);


console.log(
p
);


const message=

`🔥 FLASH SALE BLIBLI 🔥

${p.name}

💰 Harga : ${p.price}

🎁 Diskon : ${p.discount}%

🔗 ${p.link}`;


await sendTelegram(
message
);

}


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
