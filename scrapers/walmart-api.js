const axios = require("axios");

async function scrapeWalmart(query) {
  try {
    console.log("🟡 Walmart API search:", query);

    const url = `https://www.walmart.ca/api/search?query=${encodeURIComponent(query)}`;

    const res = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Accept": "application/json",
      }
    });

    const data = res.data;

    console.log("📦 Walmart raw keys:", Object.keys(data));

    const items =
      data?.items ||
      data?.products ||
      data?.searchResult?.itemStacks?.[0]?.items ||
      [];

    const results = items.map(item => ({
      title: item.name || item.title,
      price:
        item.priceInfo?.currentPrice?.price ||
        item.price ||
        null,
      link: item.productPageUrl
        ? `https://www.walmart.ca${item.productPageUrl}`
        : null,
      image:
        item.imageInfo?.thumbnailUrl ||
        item.image ||
        null,
      store: "Walmart Canada",
    })).filter(p => p.price);

    console.log("✅ Walmart results:", results.length);

    return results;

  } catch (err) {
    console.error("❌ Walmart API failed:", err.message);
    return [];
  }
}

module.exports = scrapeWalmart;