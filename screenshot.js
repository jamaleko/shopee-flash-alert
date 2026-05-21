const axios=require("axios");

async function test(){

const urls=[

"https://www.blibli.com/backend/search/products",

"https://www.blibli.com/backend/product",

"https://api.blibli.com",

"https://www.blibli.com/backend/flashsale"

];

for(const url of urls){

try{

const r=
await axios.get(
url,
{
timeout:10000,
validateStatus:()=>true
}
);

console.log(
url,
"status:",
r.status
);

}catch(e){

console.log(
url,
"error"
);

}

}

}

test();
