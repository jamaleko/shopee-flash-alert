const { chromium } = require("playwright");

(async () => {
    const browser = await chromium.launch({
        headless: true,
        args: [
            "--no-sandbox",
            "--disable-setuid-sandbox"
        ]
    });

    const page = await browser.newPage();

    await page.goto("https://www.blibli.com", {
        waitUntil: "networkidle"
    });

    console.log(await page.title());

    await page.screenshot({
        path: "debug.png",
        fullPage: true
    });

    await browser.close();
})();
