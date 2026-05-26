const axios = require("axios");

async function getDeals() {

try {

const payload=[{

operationName:"ComponentInfoQuery",

variables:{

identifier:"deals",
componentId:"605690011",
current_session_id:"",
cursor:0,
device:"mobile",
exposure_items:"",

filters:
"{\"rpc_ProductId\":[],\"category_id\":null,\"rpc_page_size\":20}"

}

}];


const res=await axios.post(
"https://gql.tokopedia.com/graphql/ComponentInfoQuery",
payload,
{
headers:{

"accept":"*/*",

"content-type":
"application/json",

"user-agent":
"Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Mobile Safari/537.36",

"referer":
"https://www.tokopedia.com/",

"bd-device-id":
"0311116359114134912",

"sec-ch-ua":
'"Not_A Brand";v="99", "Google Chrome";v="109", "Chromium";v="109"',

"sec-ch-ua-mobile":
"?1",

"sec-ch-ua-platform":
'"Android"'
}
}
);

console.log(
"STATUS:",
res.status
);

const items=
res.data?.[0]
?.data
?.componentInfo
?.data
?.component
?.data;

if(!items){

console.log(
"Data kosong"
);

return;
}

console.log(
"Jumlah:",
items.length
);

console.log("\n=== HASIL ===\n");

items.forEach(
(item,index)=>{

const diskon=
item.labels?.find(
x=>x.position==="ri_ribbon"
)?.title || "-";

console.log(
`${index+1}. ${item.name}`
);

console.log(
`Harga : ${item.price}`
);

console.log(
`Coret : ${item.discounted_price}`
);

console.log(
`Diskon : ${diskon}`
);

console.log(
`Rating : ${item.rating_average}`
);

console.log(
`Terjual : ${item.count_sold}`
);

console.log(
"--------------------"
);

});
}
catch(e){

console.log(
"ERROR:",
e.response?.status
);

console.log(
e.response?.data ||
e.message
);

}

}

getDeals();
