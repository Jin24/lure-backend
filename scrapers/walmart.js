const axios = require("axios");

async function scrapeWalmart(query) {
  try {
    const url = `https://www.walmart.ca/api/product-page/v2/search?query=${encodeURIComponent(query)}`;

    const { data } = await axios.get(url);

    const items = data?.items || [];

    return items.map(item => ({
      title: item.name,
      price: item.priceInfo?.currentPrice?.price || null,
      link: `https://www.walmart.ca${item.canonicalUrl}`,
      store: "Walmart Canada",
      image: item.imageUrl,
    })).filter(p => p.price);
    
  } catch (err) {
    console.error("Walmart API failed:", err.message);
    return [];
  }
}

module.exports = scrapeWalmart;