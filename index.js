const { chromium } = require("playwright");

async function checkFlashsale() {

const browser = await chromium.launch({
    headless:true,
    args:[
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-blink-features=AutomationControlled"
    ]
});

const context=await browser.newContext({
userAgent:
"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136 Safari/537.36",

viewport:{
width:1366,
height:768
}
});

const page=await context.newPage();

try{

console.log("Buka flashsale...");

await page.goto(
"https://www.blibli.com/flashsale",
{
waitUntil:"domcontentloaded",
timeout:60000
}
);

await page.waitForTimeout(10000);

console.log(
"Title:",
await page.title()
);

const text=await page.locator("body").innerText();

console.log(
"================ HASIL ================="
);

console.log(
text.substring(0,3000)
);

console.log(
"======================================="
);

}catch(err){

console.log(
"ERROR:",
err.message
);

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
r=>setTimeout(r,60000)
);

}

})();
