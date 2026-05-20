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

try {

console.log("Buka flashsale...");

await page.goto(
"https://www.blibli.com/flashsale",
{
waitUntil:"domcontentloaded",
timeout:60000
}
);

console.log(
"Title:",
await page.title()
);

await page.waitForTimeout(15000);

const products = await page.evaluate(() => {

let result=[];

document.querySelectorAll("*").forEach(el=>{

const text=el.innerText?.trim();

if(
text &&
text.includes("Rp")
){
result.push(text);
}

});

return [...new Set(result)]
.slice(0,50);

});

console.log("=== PRODUK ===");

products.forEach(x=>{
console.log(x);
});

}catch(err){

console.log("ERROR:",err.message);

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
