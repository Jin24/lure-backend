const axios = require("axios");

async function scrapeSail(query) {
  console.log("[SAIL] Searching for:", query);

  try {
    const url = "https://s8zq1c.a.searchspring.io/api/search/search.json";

    const params = {
      ajaxCatalog: "v3",
      resultsFormat: "native",
      siteId: "s8zq1c",
      domain: `https://www.sail.ca/en/search?q=${encodeURIComponent(query)}`,
      q: query,
    };

    const response = await axios.get(url, { params });
    const data = response.data;

    const rawProducts = data.results || [];
    console.log("[SAIL] Raw products found:", rawProducts.length);

    // Map to unified format
    const products = rawProducts.map(item => ({
      title: item.name,
      price: item.price
        ? parseFloat(item.price)
        : (item.child_final_price?.[0]
            ? parseFloat(item.child_final_price[0])
            : null),
      link: item.url ? `https://www.sail.ca${item.url}` : null,
      image: item.imageUrl || null,
      store: "SAIL Canada"
    })).filter(p => p.price && p.link);

    console.log("[SAIL] Final products:", products.length);
    return products;

  } catch (err) {
    console.log("[SAIL] Error:", err.message);
    return [];
  }
}

module.exports = scrapeSail;