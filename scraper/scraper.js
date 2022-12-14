/* var express = require("express");
var router = express.Router();

router.get("/", function (req, res, next) {
  console.log("hello");
  res.render("index", { title: "Express" });
});

module.exports = router; */

const puppeteer = require("puppeteer");
fs = require("fs-extra");

module.exports = function () {
  const urlBase =
    "https://compete.strongest.com/competitions/row-series-xii/leaderboard/";

  let data = {
    scrapedAt: 0,
    athletes: [],
  };

  const urls = [
    { url: "DJZHFR" },
    { url: "SXASNE" },
    { url: "DEZCTM" },
    { url: "XYRAGX" },
    { url: "HAKGEV" },
    { url: "GQFHJH" },
    { url: "FFSEEN" },
    { url: "XENPXJ" },
    { url: "GQRFBY" },
    { url: "VXSTD" },
    { url: "SRNZET" },
    { url: "ZVHXSJ" },
  ];

  (async () => {
    const browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    page.setViewport({ width: 1200, height: 1000 });

    for (var url of urls) {
      console.log(`Scraping ${urlBase}${url.url}...`);
      await page.goto(`${urlBase}${url.url}`);
      await page.waitForSelector(".leaderboard-item--body");

      let newData = await page.$$eval(".leaderboard-item--body", (items) => {
        return items.map((item) => {
          return {
            name: item
              .querySelector(".leaderboard-item__name")
              .textContent.trim(),
            score1A: item
              .querySelectorAll(".leaderboard-item__score--workout")[0]
              .textContent.trim(),
            score1B: item
              .querySelectorAll(".leaderboard-item__score--workout")[1]
              .textContent.trim(),
            category: item
              .closest(".competition-leaderboard")
              .querySelector(".detail-header")
              .textContent.trim(),
          };
        });
      });

      data.athletes = data.athletes.concat(newData);
    }

    data.scrapedAt = new Date();

    await fs.writeFileSync("./public/json/scrape.json", JSON.stringify(data));

    console.log("Scrape Complete");

    await browser.close();
  })();
};
