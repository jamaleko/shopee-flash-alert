const axios=require("axios");
const TelegramBot=require("node-telegram-bot-api");
//ini adalah program space
const bot=
new TelegramBot(
process.env.BOT_TOKEN,
{
polling:false
}
);

const chatId=
process.env.CHAT_ID;

const sent=
new Set();

function sleep(ms){

return new Promise(
r=>setTimeout(r,ms)
);

}

async function cekTokopedia(){

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

query:`query ComponentInfoQuery(
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
}
}`
}];


const res=
await axios.post(

"https://gql.tokopedia.com/graphql/ComponentInfoQuery",

payload,

{

timeout:30000,

headers:{

"accept":"*/*",

"content-type":
"application/json",

"user-agent":
"Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109 Mobile Safari/537.36",

"referer":
"https://www.tokopedia.com/",

"bd-device-id":
"0311116359114134912"

}

}

);

const data=
res.data?.[0]
?.data
?.componentInfo
?.data;

const products=
data.component.data || [];

console.log(
"TOTAL:",
products.length
);

for(
const p of products
){

const harga=
parseInt(
p.price
.replace("Rp","")
.replace(/\./g,"")
);

const diskon=
p.labels?.find(
x=>
x.position==="ri_ribbon"
)?.title || "0%";

const stok=
p.stock || "-";

const link=
p.url_mobile ||
p.url_desktop;

const id=
${p.product_id}-${p.price};

if(
harga<=100000 &&
!sent.has(id)
){

sent.add(id);

const msg=

`🔥 TOKOPEDIA

${p.name}

💰 Harga: ${p.price}
🎯 Diskon: ${diskon}
⭐ Rating: ${p.rating_average}
🛒 Terjual: ${p.count_sold}
📦 Stok: ${stok}

🔗 ${link}`;

await bot.sendMessage(
chatId,
msg
);

console.log(
"Kirim:",
p.name
);

}

}

return true;

}
catch(e){

console.log(
"ERROR:",
e.response?.status||
e.message
);

return false;

}

}

(async()=>{

while(true){

const ok=
await cekTokopedia();

if(ok){

console.log(
"Sleep 30 menit..."
);

await sleep(
1800000
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
