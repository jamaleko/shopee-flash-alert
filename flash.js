const axios = require("axios");

async function cekFlashSale() {

try {

const res = await axios.get(
"https://www.blibli.com/backend/content/flashsale/v2/products",
{
headers:{
"User-Agent":
"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/136 Safari/537.36"
}
}
);

const products = res.data.data;

console.log(
"Jumlah produk:",
products.length
);

for(const p of products.slice(0,5)){

console.log(
"Nama:",
p.name
);

console.log(
"Harga:",
p.offer
);

console.log(
"Diskon:",
p.discountPercentage+"%"
);

console.log(
"=========="
);

}

}catch(e){

console.log(
"ERROR:",
e.message
);

}

}

cekFlashSale();
