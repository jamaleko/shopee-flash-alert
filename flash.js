const axios = require("axios");

async function cek() {

try {

const res = await axios.get(
"https://www.blibli.com/backend/content/flashsale/v2/products",
{
headers: {

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

// tempel seluruh cookie browser milikmu sendiri
"Cookie":
process.env.BLIBLI_COOKIE
}

}
);

console.log(
"Jumlah:",
res.data.data.length
);

console.log(
"Produk pertama:",
res.data.data[0].name
);

} catch(e){

console.log(
"ERROR:",
e.response?.status || e.message
);

console.log(
e.response?.data || ""
);

}

}

cek();
