const { chromium } = require("playwright");

(async()=>{

const browser=
await chromium.launch({

headless:true,

proxy:{

server:process.env.PROXY_SERVER,
username:process.env.PROXY_USER,
password:process.env.PROXY_PASS

}

});

const page=
await browser.newPage();

await page.goto(
"https://api.ipify.org"
);

const ip=
await page.textContent("body");

console.log(
"IP:",
ip
);

await browser.close();

})();
