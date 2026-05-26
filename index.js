const axios = require("axios");

async function getFlashSale() {
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
          "referer":"https://shopee.co.id/flash_sale",
          "user-agent":
          "Mozilla/5.0 (Linux; Android 11) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109 Safari/537.36",

          "sec-fetch-mode":"cors",
          "sec-fetch-site":"same-origin"
        }
      }
    );

    console.log(
      "Status:",
      res.status
    );

    console.log(
      "Jumlah item:",
      res.data.data.item_brief_list.length
    );

    console.log(
      JSON.stringify(
        res.data.data.item_brief_list[0],
        null,
        2
      )
    );

  } catch(e){

    console.log(
      "ERROR:",
      e.response?.status || e.message
    );

    console.log(
      e.response?.data
    );

  }
}

getFlashSale();
