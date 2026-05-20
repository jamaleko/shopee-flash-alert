const { chromium } = require("playwright");

const seen = new Set();

async function checkFlashsale(){

const browser = await chromium.launch({
headless:true,
args:[
"--no-sandbox",
"--disable-setuid-sandbox",
"--disable-dev-shm-usage"
]
});

const page = await browser.newPage();

try{

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

const products = await page.evaluate(()=>{

const hasil=[];

document.querySelectorAll("*").forEach(el=>{

const text=el.innerText?.trim();

if(!text) return;

const lines=text
.split("\n")
.map(x=>x.trim())
.filter(x=>x);

const adaHarga=
lines.some(
x=>/Rp[\d\.]+/.test(x)
);

if(!adaHarga) return;

const gabung=lines.join(" | ");

if(
gabung.includes("Masuk") ||
gabung.includes("Daftar") ||
gabung.includes("BlibliCare") ||
gabung.includes("liveChat") ||
gabung.includes("original")
){
return;
}

hasil.push(gabung);

});

return [...new Set(hasil)].slice(0,30);

});

console.log("=== DISKON GILA ===");

products.forEach(item=>{
console.log("----------------");
console.log(item);
});

console.log("=== DISKON GILA ===");

for(const item of products){

let txt=item
.replace(/\n/g," ")
.replace(/\s+/g," ")
.trim();

if(
txt.length<10 ||
txt.length>300
){
continue;
}

if(seen.has(txt)){
continue;
}

seen.add(txt);

console.log("----------------");
console.log(txt);

}
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
