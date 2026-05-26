const axios = require("axios");

const headers = {
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
};

async function getFlash() {

  try{

    // ambil item id flash sale
    const res = await axios.get(
      "https://shopee.co.id/api/v4/flash_sale/get_all_itemids",
      {
        params:{
          need_personalize:true,
          promotionid:"268078273540098",
          sort_soldout:true,
          tracker_info_version:1
        },
        headers
      }
    );

    console.log(
      "STATUS:",
      res.status
    );

    const items =
    res.data.data.item_brief_list;

    console.log(
      "Jumlah item:",
      items.length
    );

    const ids =
    items
    .slice(0,20)
    .map(x=>x.itemid);

    console.log(
      "Item IDs:"
    );

    console.log(ids);


    // ambil detail item
    const detail =
    await axios.get(
      "https://shopee.co.id/api/v4/flash_sale/flash_sale_batch_get_items",
      {
        params:{
          itemids:ids.join(","),
          promotionid:"268078273540098"
        },
        headers
      }
    );

    console.log(
      JSON.stringify(
        detail.data,
        null,
        2
      )
    );

  }catch(e){

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

getFlash();
