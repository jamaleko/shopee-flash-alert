const { chromium } = require("playwright");

(async()=>{

const browser=await chromium.launch({
    headless:true
});

const page=await browser.newPage();

await page.goto(
"https://shopee.co.id/flash_sale",
{
waitUntil:"domcontentloaded"
}
);

await page.waitForTimeout(3000);


// pilih Bahasa Indonesia jika muncul

const indoButton=
page.locator(
'text=Bahasa Indonesia'
);

if(await indoButton.count()>0){

    await indoButton.click();

    await page.waitForTimeout(
        5000
    );
}

await page.screenshot({
path:"debug.png",
fullPage:true
});

console.log(
await page.title()
);

await browser.close();

})();
