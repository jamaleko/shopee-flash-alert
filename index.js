const { chromium } = require("playwright");

(async()=>{

const browser = await chromium.launch({
    headless:true
});

const page = await browser.newPage();

await page.goto(
"https://www.blibli.com/flashsale",
{
waitUntil:"networkidle"
}
);

await page.waitForTimeout(5000);

const products=await page.evaluate(()=>{

const items=[];

document
.querySelectorAll("div")

.forEach(x=>{

const text=x.innerText?.trim();

if(
text &&
text.length>10 &&
text.length<100
){

items.push(text);

}

});

return items.slice(0,20);

});

console.log(products);

await browser.close();

})();
