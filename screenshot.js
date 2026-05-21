const { chromium } = require("playwright");

(async()=>{

const browser=
await chromium.launch({

headless:true,

proxy:{
server:"http://p.webshare.io:80",
username:process.env.PROXY_USER,
password:process.env.PROXY_PASS
}

});

const page=
await browser.newPage();

page.on(
"response",
res=>{

if(
res.url().includes("blibli")
){

console.log(
"STATUS:",
res.status(),
res.url()
);

}

}
);

await page.goto(
"https://www.blibli.com/flashsale",
{
waitUntil:"domcontentloaded",
timeout:60000
}
);

await page.waitForTimeout(
5000
);

console.log(
"TITLE:",
await page.title()
);

await browser.close();

})();
