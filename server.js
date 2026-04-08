const express = require("express");
const scrapeAmazon = require("./scrapers/amazon");
const scrapeSail = require("./scrapers/sail");
const scrapeBassPro = require("./scrapers/basspro");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// Example endpoint: /search?q=rapala
app.get("/search", async (req, res) => {
  const query = req.query.q;
  if (!query) return res.status(400).json({ error: "Query missing" });

  try {
    // Run all scrapers in parallel
    const [amazonResults, sailResults, bassProResults] = await Promise.all([
      scrapeAmazon(query),
      scrapeSail(query),
      scrapeBassPro(query),
    ]);

    // Combine and normalize
    const allResults = [...amazonResults, ...sailResults, ...bassProResults];

    // Optional: sort by price ascending
    allResults.sort((a, b) => (a.price || 0) - (b.price || 0));

    res.json({
      query,
      count: allResults.length,
      results: allResults,
    });

  } catch (err) {
    console.error("[Server] Error:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`[Server] Listening on port ${PORT}`);
});