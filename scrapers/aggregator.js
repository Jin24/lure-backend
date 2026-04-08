const scrapeAmazon = require("./amazon");
const scrapeSail = require("./sail");
const scrapeBassPro = require("./basspro");

async function searchAllStores(query) {
  const results = await Promise.all([
    scrapeAmazon(query),
    scrapeSail(query),
    scrapeBassPro(query),
  ]);
  return results.flat();
}

// Example usage
(async () => {
  const searchTerm = "fishing rod";
  const data = await searchAllStores(searchTerm);
  console.log(JSON.stringify(data, null, 2));
})();