const http = require("http");
const { chromium } = require("playwright");

http.createServer((req,res)=>{
    res.end("ok");
}).listen(process.env.PORT || 3000);

(async()=>{

const browser=await chromium.launch({
    headless:true
});

const page=await browser.newPage({
    userAgent:
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124.0 Safari/537.36"
});

try{

console.log("Buka Blibli");

await page.goto(
"https://www.blibli.com/flashsale",
{
waitUntil:"domcontentloaded",
timeout:60000
}
);

await page.waitForTimeout(10000);

console.log(
await page.title()
);

await page.screenshot({
path:"debug.png",
fullPage:true
});

console.log("Screenshot dibuat");

}catch(e){

console.log(e);

}

await browser.close();

})();
