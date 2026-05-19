const { chromium } = require("playwright");

(async () => {

    const browser = await chromium.launch({
        headless: true
    });

    const page = await browser.newPage({

        userAgent:
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124.0 Safari/537.36"

    });

    try {

        console.log("Membuka Blibli...");

        await page.goto(
            "https://www.blibli.com/flashsale",
            {
                waitUntil: "domcontentloaded",
                timeout: 60000
            }
        );

        console.log("Menunggu halaman...");

        await page.waitForTimeout(10000);

        const title = await page.title();

        console.log(
            "Judul halaman:",
            title
        );

        await page.screenshot({

            path: "debug.png",

            fullPage: true

        });

        console.log(
            "screenshot dibuat"
        );

    } catch(err){

        console.log(
            "ERROR:"
        );

        console.log(err);

    }

    await browser.close();

})();
