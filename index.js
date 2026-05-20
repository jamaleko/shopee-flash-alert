const axios = require("axios");
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

try{

console.log(
"Ambil data blibli..."
);

/*
SEARCH PRODUK
lebih stabil dibanding flashsale page
*/

const url =
"https://www.blibli.com/backend/search/products?searchTerm=flashsale&start=0&itemPerPage=10";

const res =
await axios.get(url,{

headers:{

"User-Agent":
"Mozilla/5.0"

},

timeout:30000

});

const data =
res.data;

let products=[];

/*
ambil product list
*/

if(
data &&
data.data &&
data.data.products
){

products =
data.data.products;

}

console.log(
"Jumlah produk:",
products.length
);

if(
products.length===0
){

console.log(
"Tidak ada produk"
);

return;

}

let pesan =
"🔥 BLIBLI FLASHSALE 🔥\n\n";

products.forEach(item=>{

const nama =
item.name || "Produk";

const harga =
item.price?.priceDisplay ||
item.price?.minPrice ||
"-";

const link =
"https://www.blibli.com" +
(item.url || "");

console.log(
nama
);

pesan +=

`📦 ${nama}

💰 ${harga}

🔗 ${link}

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
