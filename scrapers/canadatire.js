const { launchBrowser } = require("../browser");
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
async function scrapeCanadianTire(query) {
  const browser = await launchBrowser();
  const page = await browser.newPage();

  await page.goto(
    `https://www.canadiantire.ca/en/search.html?q=${encodeURIComponent(query)}`,
    { waitUntil: "networkidle2", timeout: 0 }
  );

  await autoScroll(page);
  await sleep(2000);

  const results = await page.$$eval("li.product-tile, li.product-tile-wrapper", items =>
    items.map(item => {
      const title = item.querySelector(".product-title")?.innerText || item.querySelector(".product-name")?.innerText;
      const priceText = item.querySelector(".product-price")?.innerText || item.querySelector(".sale-price")?.innerText;
      const link = item.querySelector("a")?.href;
      const image = item.querySelector("img")?.src;
      return {
        title,
        price: priceText ? parseFloat(priceText.replace("$", "").replace(",", "")) : null,
        link,
        store: "Canadian Tire",
        image,
      };
    })
  );

  await browser.close();
  return results.filter(r => r.price != null);
}

async function autoScroll(page){
  await page.evaluate(async () => {
    await new Promise(resolve => {
      let totalHeight = 0;
      const distance = 100;
      const timer = setInterval(() => {
        window.scrollBy(0, distance);
        totalHeight += distance;
        if(totalHeight >= document.body.scrollHeight){
          clearInterval(timer);
          resolve();
        }
      }, 100);
    });
  });
}

module.exports = scrapeCanadianTire;