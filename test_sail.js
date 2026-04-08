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

    // Log the entire response (truncated to first 5000 chars if too big)
    const pretty = JSON.stringify(data, null, 2);
    console.log("[SAIL] Full response (truncated 5000 chars):\n", pretty.slice(0, 5000));

    return data; // just return raw data for now

  } catch (err) {
    console.log("[SAIL] Error:", err.message);
    return null;
  }
}

// Test
(async () => {
  await scrapeSail("rapala");
})();