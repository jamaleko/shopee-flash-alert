const { chromium } = require("playwright");

async function checkFlashsale() {

const browser=await chromium.launch({
headless:true,
args:[
"--no-sandbox",
"--disable-setuid-sandbox",
"--disable-dev-shm-usage"
]
});

const page=await browser.newPage();

try{

console.log("Buka flashsale...");

await page.goto(
"https://www.blibli.com/flashsale",
{
waitUntil:"domcontentloaded",
timeout:60000
}
);

await page.waitForTimeout(15000);

console.log(
"Title:",
await page.title()
);

const text=await page.evaluate(()=>{
return document.body.innerText;
});

console.log(
"============== BODY =============="
);

console.log(
text.substring(0,3000)
);

console.log(
"================================="
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

console.log("Sleep 60 detik...");

await new Promise(
r=>setTimeout(r,60000)
);

}

})();
