const axios = require("axios");

async function getFlash() {
  try {

    const res = await axios.get(
      "https://shopee.co.id/api/v4/flash_sale/get_all_itemids",
      {
        params: {
          need_personalize: true,
          promotionid: "268078273540098",
          sort_soldout: true,
          tracker_info_version: 1
        },

        headers: {
          "accept":"*/*",
          "referer":
          "https://shopee.co.id/flash_sale?categoryId=0&promotionId=268078273540098",

          "user-agent":
          process.env.UA,

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
