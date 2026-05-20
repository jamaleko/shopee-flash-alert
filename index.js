import puppeteer from 'puppeteer';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

const TELEGRAM_BOT_TOKEN = process.env.BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.CHAT_ID;

async function sendTelegram(message) {
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            chat_id: TELEGRAM_CHAT_ID,
            text: message,
            parse_mode: 'HTML'
        })
    });
}

(async () => {
    const browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });
    const page = await browser.newPage();
    await page.goto('https://www.blibli.com/flashsale', { waitUntil: 'networkidle2' });

    console.log('Buka flashsale Blibli...');

    // Tunggu load
    await page.waitForTimeout(10000);

    // Ambil produk yang sedang berlangsung
    const products = await page.evaluate(() => {
        const result = [];
        document.querySelectorAll('div.product-card').forEach(card => {
            const statusEl = card.querySelector('.product-card__badge-text');
            const linkEl = card.querySelector('a.product-card__link');

            if (statusEl && statusEl.innerText.trim().toLowerCase() === 'berlangsung' && linkEl) {
                const titleEl = card.querySelector('.product-card__title');
                const priceEl = card.querySelector('.product-card__price--main');

                result.push({
                    title: titleEl ? titleEl.innerText.trim() : '',
                    price: priceEl ? priceEl.innerText.trim() : '',
                    link: linkEl.href
                });
            }
        });
        return result;
    });

    if (products.length === 0) {
        console.log('Tidak ada produk flash sale berlangsung.');
        await sendTelegram('⚠️ Tidak ada produk flash sale yang sedang berlangsung saat ini.');
    } else {
        let message = '🔥 <b>FLASH SALE BLIBLI BERLANGSUNG</b> 🔥\n\n';
        products.forEach((p, idx) => {
            message += `${idx + 1}. ${p.title}\nHarga: ${p.price}\n<a href="${p.link}">Link Produk</a>\n\n`;
        });

        console.log(message);
        await sendTelegram(message);
    }

    await browser.close();
})();
