const axios = require("axios");
const cheerio = require("cheerio");

async function scrapeTackleDepot(query) {
  try {
    const url = `https://www.tackledepot.com/search.html?search=${encodeURIComponent(query)}`;
    const { data } = await axios.get(url);

    const $ = cheerio.load(data);
    const results = [];

    $(".product").each((i, el) => {
      if (i > 20) return;

      results.push({
        title: $(el).find(".product-name").text().trim(),
        price: $(el).find(".price").text().trim(),
        link: "https://www.tackledepot.com" + $(el).find("a").attr("href"),
        image: $(el).find("img").attr("src"),
        store: "Tackle Depot"
      });
    });

    return results;

  } catch (err) {
    console.log("TackleDepot failed:", err.message);
    return [];
  }
}

module.exports = scrapeTackleDepot;