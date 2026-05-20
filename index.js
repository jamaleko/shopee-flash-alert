const { chromium } = require("playwright");

(async () => {
  const browser = await chromium.launch({
    headless: true
  });

  const page = await browser.newPage();

  await page.goto("https://www.blibli.com", {
    waitUntil: "networkidle"
  });

  console.log("Title:", await page.title());

  await page.setViewportSize({
    width: 1280,
    height: 720
  });
  
  await page.screenshot({
    path: "debug.png"
  });

  await browser.close();

  console.log("Done");
})();
