const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");

puppeteer.use(StealthPlugin());

async function scrapeAmazon(query) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox"]
  });

  const page = await browser.newPage();

  await page.goto(
    `https://www.amazon.ca/s?k=${encodeURIComponent(query)}`,
    { waitUntil: "domcontentloaded" }
  );

  await page.waitForSelector("[data-component-type='s-search-result']");

  const results = await page.$$eval(
    "[data-component-type='s-search-result']",
    items =>
      items.map(item => ({
        title: item.querySelector("h2 span")?.innerText,
        price: item.querySelector(".a-price-whole")?.innerText,
        link: item.querySelector("h2 a")?.href,
        store: "Amazon Canada"
      }))
  );

  await browser.close();

  return results
    .map(r => ({
      ...r,
      price: r.price ? parseFloat(r.price.replace(",", "")) : null
    }))
    .filter(r => r.price);
}

module.exports = scrapeAmazon;