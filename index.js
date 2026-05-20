const { chromium } = require("playwright");

async function checkFlashsale() {
  const browser = await chromium.launch({
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-blink-features=AutomationControlled"
    ]
  });

  const context = await browser.newContext({
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36",

    viewport: {
      width: 1366,
      height: 768
    },

    locale: "id-ID"
  });

  const page = await context.newPage();

  // sembunyikan webdriver
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "webdriver", {
      get: () => false
    });
  });

  try {
    console.log("Buka flashsale...");

    await page.goto(
      "https://www.blibli.com/flashsale",
      {
        waitUntil: "domcontentloaded",
        timeout: 60000
      }
    );

    // tunggu redirect otomatis
    await page.waitForURL(/schedule=/, {
      timeout: 30000
    });

    console.log(
      "URL Final:",
      page.url()
    );

    console.log(
      "Title:",
      await page.title()
    );

    // tunggu produk muncul
    await page.waitForTimeout(5000);

    const products = await page.locator(
      'a[href*="/p/"]'
    ).allTextContents();

    console.log(
      "Jumlah produk:",
      products.length
    );

    console.log(
      products.slice(0,10)
    );

  } catch(err) {
    console.log("ERROR:");
    console.log(err.message);
  }

  await browser.close();
}

(async()=>{

while(true){

  await checkFlashsale();

  console.log(
    "Sleep 60 detik..."
  );

  await new Promise(
    r => setTimeout(r,60000)
  );

}

})();
