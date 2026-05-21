const axios = require("axios");
const TelegramBot = require("node-telegram-bot-api");

const bot = new TelegramBot(
process.env.BOT_TOKEN,
{
polling:false
}
);

const chatId=
process.env.CHAT_ID;

/*
supaya produk yg sama
tidak dikirim terus
*/

const sentProducts=
new Set();

async function sleep(ms){

return new Promise(
r=>setTimeout(r,ms)
);

}

async function cekFlashSale(){

try{

console.log(
"Ambil flash sale..."
);

const res=
await axios.get(
"https://www.blibli.com/backend/content/flashsale/v2/products",
{
headers:{

"Accept":
"text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",

"Accept-Language":
"en-GB,en-US;q=0.9,en;q=0.8",

"User-Agent":
"Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109 Mobile Safari/537.36",

"Referer":
"https://www.blibli.com/flashsale",

"sec-ch-ua":
'"Not_A Brand";v="99","Google Chrome";v="109","Chromium";v="109"',

"sec-ch-ua-mobile":
"?1',

"sec-ch-ua-platform":
'"Android"',

"Cookie":
process.env.BLIBLI_COOKIE

}

}
);

const items=
res.data.data || [];

console.log(
"Jumlah:",
items.length
);

const promo=
items.filter(item=>

item?.name &&
item?.price?.discount>=50

);

console.log(
"Diskon >=50%:",
promo.length
);

if(
promo.length===0
){

console.log(
"Tidak ada promo"
);

return;

}

for(
const item of promo
){

const id=
item.sku;

if(
sentProducts.has(id)
){

continue;

}

sentProducts.add(
id
);

const pesan=

🔥 FLASH SALE BLIBLI 🔥

📦 ${item.name}

💰 Normal:
${item.price.list}

🔥 Flash:
${item.price.offer}

📉 Diskon:
${item.price.discount}%

📦 Sisa:
${item.inventory?.remaining || "-"}

🔗 https://www.blibli.com${item.url}
;

console.log(
item.name
);

await bot.sendMessage(
chatId,
pesan
);

console.log(
"Telegram terkirim"
);

}

}
catch(e){

console.log(
"ERROR:",
e.response?.status ||
e.message
);

}

}

(async()=>{

while(true){

await cekFlashSale();

console.log(
"Sleep 5 menit..."
);

await sleep(
300000
);

}

})();
