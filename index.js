const browser = await chromium.launch({
    headless: true,
    args: [
        "--no-sandbox",
        "--disable-setuid-sandbox"
    ]
});
console.log("Playwright:", require("playwright"));
console.log(
    "Telegram:",
    require("node-telegram-bot-api")
);

console.log("Semua module OK");
