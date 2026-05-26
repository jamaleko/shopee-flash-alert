const axios = require("axios");

async function getFlash() {
  try {

    const res = await axios.get(
      "https://shopee.co.id/api/v4/flash_sale/flash_sale_batch_get_items",
      {
        params:{
          promotionid:"268078273540098",
          categoryid:0,
          limit:100,
          offset:0
        },

        headers:{
          "accept":"*/*",

          "referer":
          "https://shopee.co.id/flash_sale?categoryId=0&promotionId=268078273540098",

          "user-agent":
          "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Mobile Safari/537.36",

          "cookie":
          process.env.SHOPEE_COOKIE,

          "af-ac-enc-dat":
          process.env.AF_DATA,

          "af-ac-enc-sz-token":
          process.env.AF_TOKEN
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

  } catch(e){

    console.log(
      "ERROR:",
      e.response?.status
    );

    console.log(
      e.response?.data
    );
  }
}

getFlash();
