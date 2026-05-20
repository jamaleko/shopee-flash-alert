const { chromium } = require("playwright");

async function check() {
    const browser = await chromium.launch({
        headless:true,
        args:[
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-dev-shm-usage",
            "--disable-blink-features=AutomationControlled"
        ]
    });

    const context = await browser.newContext({
        userAgent:
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36",
        locale:"id-ID"
    });

    const page = await context.newPage();

    await page.goto(
        "https://www.blibli.com",
        {
            waitUntil:"domcontentloaded",
            timeout:60000
        }
    );

    console.log(
        "Title:",
        await page.title()
    );

    await browser.close();
}

(async()=>{

while(true){

try{
    await check();
}catch(err){
    console.log(err.message);
}

console.log("Sleep 60 sec");

await new Promise(r=>setTimeout(r,60000));

}

})();
