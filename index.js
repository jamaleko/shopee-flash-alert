const axios=require("axios");

const BOT_TOKEN=process.env.BOT_TOKEN;
const CHAT_ID=process.env.CHAT_ID;

const cacheHarga={};

function sleep(ms){

return new Promise(
r=>setTimeout(r,ms)
);

}

async function kirimTelegram(text){

try{

await axios.get(
`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
{
params:{
chat_id:CHAT_ID,
text:text
}
}
);

}catch(e){

console.log(
"Telegram Error:",
e.message
);

}

}

async function getDeals(){

try{

const payload=[{

operationName:"ComponentInfoQuery",

variables:{

identifier:"deals",

componentId:"605690011",

filters:
"{\"rpc_ProductId\":\"\",\"category_id\":null,\"rpc_page_size\":\"20\",\"rpc_page_number\":\"1\",\"rpc_CampaignId\":\"0\",\"rpc_UserID\":\"2770349\",\"rpc_PinnedProduct\":\"\",\"rpc_UserAddressId\":\"12290452\",\"rpc_UserCityId\":\"72\",\"rpc_UserDistrictId\":\"797\",\"rpc_UserLat\":\"-0.6973589999999971\",\"rpc_UserLong\":\"102.85148370000002\",\"rpc_UserPostCode\":\"29274\",\"rpc_UserWarehouseId\":\"0\",\"rpc_UserWarehouseIds\":\"\",\"l_name\":\"sre\"}",

device:"mobile",

refresh_type:"0",

current_session_id:"",

exposure_items:"",

cursor:0

},

query:`
query ComponentInfoQuery(
$identifier:String!,
$componentId:String!,
$device:String!,
$filters:String,
$exposure_items:String,
$refresh_type:String,
$current_session_id:String,
$cursor:Int
){

componentInfo(

identifier:$identifier,
component_id:$componentId,
device:$device,
filters:$filters,
exposure_items:$exposure_items,
refresh_type:$refresh_type,
current_session_id:$current_session_id,
cursor:$cursor

){

data
__typename

}

}
`

}];


console.log(
"Request Tokopedia..."
);

const res=await axios({

method:"post",

url:
"https://gql.tokopedia.com/graphql/ComponentInfoQuery",

timeout:60000,

data:payload,

headers:{

"accept":"*/*",

"content-type":
"application/json",

"user-agent":
"Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109 Mobile Safari/537.36",

"referer":
"https://www.tokopedia.com/",

"origin":
"https://www.tokopedia.com",

"accept-language":
"en-US,en;q=0.9",

"bd-device-id":
"0311116359114134912",

"sec-ch-ua":
'"Not_A Brand";v="99","Google Chrome";v="109","Chromium";v="109"',

"sec-ch-ua-mobile":
"?1",

"sec-ch-ua-platform":
'"Android"'

}

});


const data=
res.data?.[0]
?.data
?.componentInfo
?.data;

if(!data){

console.log(
"Tidak ada data"
);

return;

}

const products=
data.component.data;

console.log(
"TOTAL:",
products.length
);

for(const p of products){

const harga=
parseInt(
p.price
.replace("Rp","")
.replace(/\./g,"")
.trim()
);

const diskon=
p.labels?.find(
x=>x.position==="ri_ribbon"
)?.title || "0%";

const stok=
p.stock || 0;

const link=
p.url_mobile ||
p.url_desktop ||
"https://www.tokopedia.com";

if(harga<=100000){

const id=
p.product_id;

if(

cacheHarga[id] &&
cacheHarga[id]===harga

){

console.log(
"Skip:",
p.name
);

continue;

}

cacheHarga[id]=harga;

console.log(
"\n==============="
);

console.log(
"Nama:",
p.name
);

console.log(
"Harga:",
p.price
);

console.log(
"Diskon:",
diskon
);

console.log(
"Terjual:",
p.count_sold
);

console.log(
"Rating:",
p.rating_average
);

console.log(
"Stok:",
stok
);

console.log(
"Link:",
link
);

const pesan=

`🔥 TOKOPEDIA

${p.name}

💰 Harga: ${p.price}
🎯 Diskon: ${diskon}
⭐ Rating: ${p.rating_average}
🛒 Terjual: ${p.count_sold}
📦 Stok: ${stok}

🔗 ${link}`;

await kirimTelegram(
pesan
);

}

}

}catch(e){

console.log(
"ERROR:",
e.message
);

throw e;

}

}

async function start(){

while(true){

try{

console.log(
"\nMulai cek:",
new Date()
.toLocaleString()
);

await getDeals();

console.log(
"\nSleep 30 menit..."
);

await sleep(
30*60*1000
);

}catch(e){

console.log(
"\nRetry 30 detik..."
);

await sleep(
30000
);

}

}

}

start();
