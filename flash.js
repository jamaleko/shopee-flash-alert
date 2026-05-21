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

const sentProducts=
new Set();

function sleep(ms){

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
"?1",

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
items.filter(
x=>x?.price?.discount>=70
);

console.log(
"Diskon >=50%:",
promo.length
);

for(
const item of promo
){

if(
sentProducts.has(item.sku)
){

continue;
}

sentProducts.add(
item.sku
);

console.log(
"Kirim:",
item.name
);

const msg=
`🔥 FLASH SALE

📦 ${item.name}

💰 Normal:
${item.price.list}

🔥 Flash:
${item.price.offer}

📉 Diskon:
${item.price.discount}%

📦 Sisa:
${item.inventory?.remaining||"-"}
`;

await bot.sendMessage(
chatId,
msg
);

console.log(
"Telegram terkirim"
);

}

return true;

}
catch(e){

console.log(
"ERROR:",
e.response?.status || e.message
);

return false;

}

}

(async()=>{

while(true){

const success=
await cekFlashSale();

if(success){

console.log(
"Semua selesai"
);

console.log(
"Sleep 5 menit..."
);

await sleep(
300000
);

}
else{

console.log(
"Retry 30 detik..."
);

await sleep(
30000
);

}

}

})();
