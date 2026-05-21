const { chromium } = require("playwright");

(async()=>{

let browser;

try{

console.log(
"Token:",
process.env.BROWSERLESS_TOKEN?.slice(0,5)
);

console.log(
"Connect..."
);

browser=
await chromium.connectOverCDP(
`https://production-sfo.browserless.io?token=${process.env.BROWSERLESS_TOKEN}`
);

console.log(
"CONNECTED OK"
);

const contexts=
browser.contexts();

console.log(
"Context:",
contexts.length
);

}catch(e){

console.log(
"ERROR:"
);

console.log(
e.message
);

}
finally{

if(browser){

await browser.close();

console.log(
"Closed"
);

}

}

process.exit(0);

})();
