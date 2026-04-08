const axios = require("axios");

async function scrapeBassPro(query) {
  console.log("[BassPro] Using Coveo API...");

  // 🔴 REPLACE THESE WITH VALUES YOU FOUND IN NETWORK TAB
  const ACCESS_TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJmaWx0ZXIiOiJAc291cmNlPT1CYXNzUHJvQ2F0YWxvZ1BST0QgT1IgQHNvdXJjZT09QmFzc1Byb0NhdGFsb2dQUk9ELUdSRUVOIiwidjgiOnRydWUsInRva2VuSWQiOiJ3NXp4dWxta2lhczZiYTRvemIycHQzc3A2aSIsIm9yZ2FuaXphdGlvbiI6ImJhc3Nwcm9zaG9wc3Byb2R1Y3Rpb25sOTJlcHltciIsInVzZXJJZHMiOlt7InR5cGUiOiJVc2VyIiwibmFtZSI6ImFub255bW91cyIsInByb3ZpZGVyIjoiRW1haWwgU2VjdXJpdHkgUHJvdmlkZXIifV0sInJvbGVzIjpbInF1ZXJ5RXhlY3V0b3IiXSwiaXNzIjoiU2VhcmNoQXBpIiwiZXhwIjoxNzc1NzA1MjU5LCJpYXQiOjE3NzU2OTA4NTl9.OkW-xfeygCJz_xdnQOgB14gpjvqKDvNbdICKrSq7pb0";
  const ORG_ID = "bassproshopsproductionl92epymr"; // example — replace if different

  const url = `https://platform.cloud.coveo.com/rest/search/v2`;

  try {
    const response = await axios.post(
      url,
      {
        q: query,
        numberOfResults: 24,
        firstResult: 0,
        locale: "en",
      },
      {
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
      }
    );

    const results = response.data.results || [];

    const parsed = results.map(item => {
      const raw = item.raw || {};

      return {
        title: item.title,
        price: raw.ec_price
          ? parseFloat(raw.ec_price)
          : null,
        link: raw.ec_product_url
          ? `https://www.basspro.ca${raw.ec_product_url}`
          : item.clickUri,
        image: raw.ec_image || raw.ec_images?.[0],
        store: "Bass Pro Canada",
      };
    });


    console.log("[BassPro] Found products:", parsed.length);

    return parsed.filter(p => p.price && p.link);

  } catch (err) {
    console.log("[BassPro] Error:", err.response?.status, err.message);
    return [];
  }
}

module.exports = scrapeBassPro;