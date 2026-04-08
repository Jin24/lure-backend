const puppeteer = require("puppeteer");

async function launchBrowser() {
  return await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
}

module.exports = { launchBrowser };