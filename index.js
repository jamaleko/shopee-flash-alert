const { chromium } = require("playwright");

(async () => {
    console.log("Playwright OK");

    const browser = await chromium.launch({
        headless: true,
        args: [
            "--no-sandbox",
            "--disable-setuid-sandbox"
        ]
    });

    console.log("Browser OK");

    await browser.close();

    setInterval(()=>{},1000);
})();
