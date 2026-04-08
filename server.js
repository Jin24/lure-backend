const express = require("express");
const scrapeAmazon = require("./scraper/amazon");
const { getCache, setCache } = require("./cache");

const app = express();

app.get("/api/lures", async (req, res) => {
  const query = req.query.q || "fishing lure";

  const cacheKey = `lures:${query}`;
  const cached = await getCache(cacheKey);

  if (cached) return res.json(cached);

  const results = await scrapeAmazon(query);

  results.sort((a, b) => a.price - b.price);

  await setCache(cacheKey, results);

  res.json(results);
});

app.listen(process.env.PORT || 5000);