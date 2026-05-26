const axios=require("axios");

async function test(){

try{

const res=
await axios.post(

"https://shopee.co.id/api/v4/flash_sale/flash_sale_batch_get_items",

{

promotionid:268083365429251,

itemids:[
43867563107,
19850207725,
40328681658,
24633769824
]

},

{

headers:{

"accept":"*/*",

"user-agent":
"Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Mobile Safari/537.36",

"referer":
"https://shopee.co.id/flash_sale",

"cookie":
process.env.SHOPEE_COOKIE,

"af-ac-enc-dat":
process.env.AF_DATA,

"af-ac-enc-sz-token":
process.env.AF_TOKEN,

"x-requested-with":
"XMLHttpRequest",

"x-api-source":
"rweb"

}

}

);

console.log(
JSON.stringify(
res.data,
null,
2
)
);

}catch(e){

console.log(
"ERROR:",
e.response?.status
);

console.log(
e.response?.data
);

}

}

test();
