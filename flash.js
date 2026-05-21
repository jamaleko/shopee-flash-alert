const axios = require("axios");

async function getFlashSale() {
    try {
        const res = await axios.get(
            "https://www.blibli.com/backend/content/flashsale/v2/products",
            {
                headers: {
                    "User-Agent": process.env.USER_AGENT,
                    "Cookie": process.env.BLIBLI_COOKIE,
                    "Referer": "https://www.blibli.com/flashsale"
                }
            }
        );

        return res.data.data;

    } catch(e){
        console.log(
            "ERROR:",
            e.response?.status || e.message
        );

        return [];
    }
}

(async()=>{

const items=await getFlashSale();

for(const item of items){

console.log(
${item.name}
Harga: ${item.price.offer}
Sisa: ${item.inventory.remaining}

);

}

})();
