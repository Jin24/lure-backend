const { launchBrowser } = require("../browser");

async function scrapeAmazon(query) {
  const browser = await launchBrowser();
  const page = await browser.newPage();

  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36"
  );

  await page.goto(
    `https://www.amazon.ca/s?k=${encodeURIComponent(query)}`,
    { waitUntil: "networkidle2", timeout: 0 }
  );

  await page.waitForSelector("[data-component-type='s-search-result']", { timeout: 15000 });

  const results = await page.$$eval("[data-component-type='s-search-result']", items =>
    items.map(item => {
      const title = item.querySelector("h2 span")?.innerText;
      const priceText = item.querySelector(".a-price-whole")?.innerText;
      const link = item.querySelector("h2 a")?.href;
      const image = item.querySelector("img.s-image")?.src;
      return {
        title,
        price: priceText ? parseFloat(priceText.replace(",", "")) : null,
        link,
        store: "Amazon Canada",
        image,
      };
    })
  );

  await browser.close();
  return results.filter(r => r.price != null);
}

module.exports = scrapeAmazon;