const puppeteer = require("puppeteer");
fs = require("fs-extra");

module.exports = function () {
    const urlBase =
        "https://compete.strongest.com/competitions/rowd-royalty-indoor-rowing-competition-2023/leaderboard/";

    let data = {
        scrapedAt: 0,
        athletes: [],
    };

    const urls = [
        { url: "WVFXR" },
        { url: "EHFZM" },
        { url: "GXTCAK" },
        { url: "BPSZKP" },
    ];

    (async () => {
        const browser = await puppeteer.launch({
            args: ["--no-sandbox", "--disable-setuid-sandbox"],
        });
        const page = await browser.newPage();
        page.setViewport({ width: 1200, height: 8000 });

        for (var url of urls) {
            console.log(`Scraping ${urlBase}${url.url}...`);
            await page.goto(`${urlBase}${url.url}`);
            await page.waitForSelector(".leaderboard-item--body");

            await grabData(page, data);
            await page.evaluate(() => {
                window.scrollBy(0, 5000);
            });
            await page.waitForSelector(".leaderboard-item--body");
            await page.waitForTimeout(2000);

            await grabData(page, data);

            await page.evaluate(() => {
                window.scrollBy(0, 5000);
            });
            await page.waitForSelector(".leaderboard-item--body");
            await page.waitForTimeout(2000);

            await grabData(page, data);

            await page.evaluate(() => {
                window.scrollBy(0, 5000);
            });
            await page.waitForSelector(".leaderboard-item--body");
            await page.waitForTimeout(2000);

            await grabData(page, data);
        }

        let uniqueRecord = [];
        data.athletes = data.athletes.reduce((accumulator, current) => {
            if (
                uniqueRecord.indexOf(current.name + "-" + current.category) < 0
            ) {
                uniqueRecord.push(current.name + "-" + current.category);
                accumulator.push(current);
            }
            return accumulator;
        }, []);
        data.scrapedAt = new Date();

        await fs.writeFileSync(
            "./public/json/rowd-royalty-2023.json",
            JSON.stringify(data)
        );

        console.log("Scrape Complete");

        await browser.close();
    })();
};

async function grabData(page, data) {
    let newData = await page.$$eval(".leaderboard-item--body", (items) => {
        return items.map((item) => {
            return {
                name: item
                    .querySelector(".leaderboard-item__name")
                    ?.textContent.trim(),
                score1A: item
                    .querySelectorAll(".leaderboard-item__score--workout")?.[0]
                    ?.textContent.trim(),
                score1B: item
                    .querySelectorAll(".leaderboard-item__score--workout")?.[1]
                    ?.textContent.trim(),
                /*
                            score2A: item
                                .querySelectorAll(
                                    ".leaderboard-item__score--workout"
                                )[2]
                                .textContent.trim(),
                            score2B: item
                                .querySelectorAll(
                                    ".leaderboard-item__score--workout"
                                )[3]
                                .textContent.trim(),
                            score3A: item
                                .querySelectorAll(
                                    ".leaderboard-item__score--workout"
                                )[4]
                                .textContent.trim(),
                            score3B: item
                                .querySelectorAll(
                                    ".leaderboard-item__score--workout"
                                )[5]
                                .textContent.trim(),
                            score4A: item
                                .querySelectorAll(
                                    ".leaderboard-item__score--workout"
                                )[6]
                                .textContent.trim(),
                            score4B: item
                                .querySelectorAll(
                                    ".leaderboard-item__score--workout"
                                )[7]
                                .textContent.trim(),*/
                category: item
                    .closest(".competition-leaderboard")
                    ?.querySelector(".detail-header")
                    ?.textContent.trim(),
                subCategory: "",
            };
        });
    });

    data.athletes = data.athletes.concat(newData);

    return;
}

async function autoScroll(page) {
    await page.evaluate(async () => {
        await new Promise((resolve) => {
            window.scrollBy(0, distance);
            var totalHeight = 0;
            var distance = 500;
            var timer = setInterval(() => {
                var scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;

                if (totalHeight >= scrollHeight - window.innerHeight) {
                    clearInterval(timer);
                    resolve();
                }
            }, 100);
        });
    });
}
