const express = require("express");
const cors = require("cors");
const scrapeAmazon = require("./scrapers/amazon");
const scrapeBassPro = require("./scrapers/basspro");
const scrapeSail = require("./scrapers/sail");

const app = express();

// ⚡ Allow CORS for all origins (for dev)
app.use(cors());

// If you want to restrict to your frontend domain in production:
// app.use(cors({ origin: "http://localhost:3000" }));

const PORT = process.env.PORT || 5000;

app.get("/search", async (req, res) => {
  const { query } = req.query;
  if (!query) return res.status(400).json({ error: "Query required" });

  try {
    const [amazon, basspro, sail] = await Promise.all([
      scrapeAmazon(query),
      scrapeBassPro(query),
      scrapeSail(query)
    ]);

    const allResults = [...amazon, ...basspro, ...sail];
    res.json({ query, count: allResults.length, results: allResults });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});