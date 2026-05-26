const axios=require("axios");

async function getDeals(){

try{

const payload=[{

operationName:"ComponentInfoQuery",

variables:{
identifier:"deals",
componentId:"605690011",
current_session_id:"",
cursor:0,
device:"mobile",
exposure_items:"",
filters:"{\"rpc_ProductId\":\"\",\"category_id\":null,\"rpc_page_size\":20}"
},

query:
"query ComponentInfoQuery($identifier:String!,$componentId:String!,$current_session_id:String,$cursor:Int,$device:String,$exposure_items:String,$filters:String){componentInfo(identifier:$identifier,componentId:$componentId,current_session_id:$current_session_id,cursor:$cursor,device:$device,exposure_items:$exposure_items,filters:$filters){data}}"

}];


const res=await axios.post(
"https://gql.tokopedia.com/graphql/ComponentInfoQuery",
payload,
{
timeout:30000,

headers:{

"accept":"*/*",

"content-type":
"application/json",

"user-agent":
"Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Mobile Safari/537.36",

"referer":
"https://www.tokopedia.com/",

"origin":
"https://www.tokopedia.com",

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
e.code
);

console.log(
e.message
);

}

}

getDeals();
