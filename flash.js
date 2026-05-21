const axios=require("axios");

async function cek(){

try{

const res=await axios.get(
"https://www.blibli.com/backend/content/flashsale/v2/products",
{
headers:{
"User-Agent":
"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/136 Safari/537.36",

"Cookie":
`cf_clearance=9A0RJjuoeiWiudeOr2PoIMJXL9_pG0_GB3cO0bpFqlI-1779353126-1.2.1.1-Bo2NbCwe6ZymTXHLwO_YxFNen4GCKKshBdGL.xb6xJeb90EqdyJJJ7OdLMA5rsVnoDNXBRGL_fTFVshdbTbbnqHy8Tu5mZLvCww0uk8PFLdtQdd_TK.mhDndJoOEPp0WiEo107o8chPQ7i9DbJB8XXVGTYRNhyHFrqH8gBpw42ZeoMRcMfJDN_AsgIvxab8DxZZpFynR_DS2XGpBc4xin.xed1zp6d0RZ0Kbx_IvDL9jVH_fk6VaTvUjVfiQkP_myJOkmZSg1UwE.m6W4A3.tgCINswox5AAHv5DkadNLgAfsWH8te7xjPQI5J8NL.vVbbcHA36RqPJiYOCYLRSsVe3HxQYCTJdhSyZ.0pvFqIhZMRUZWHY_70CmnI9JUlqLHb4OkS9CByCW6j_oay01XfMzf0tTIL4GObHVBSnpMRM`
}
}
);

console.log(
"Jumlah:",
res.data.data.length
);

console.log(
res.data.data[0]
);

}catch(e){

console.log(
"ERROR:",
e.response?.status || e.message
);

}

}

cek();
