const puppeteer = require("puppeteer");
fs = require("fs-extra");

module.exports = function () {
    const urlBase =
        "https://compete.strongest.com/competitions/rowd-royalty-indoor-rowing-competition-2023/leaderboard/";

    let data = {
        scrapedAt: 0,
        athletes: [],
    };

    const toScrape = [
        {
            url: "WVFXR?a%5B0%5D=JXVBMJ",
            division: "Men - Tall (5'11\"+/180cm+)",
            group: "-40",
        },
        {
            url: "WVFXR?a%5B0%5D=RPHWAE",
            division: "Men - Tall (5'11\"+/180cm+)",
            group: "40-49",
        },
        {
            url: "WVFXR?a%5B0%5D=KYKGYV",
            division: "Men - Tall (5'11\"+/180cm+)",
            group: "50-59",
        },
        {
            url: "WVFXR?a%5B0%5D=NCAWGV",
            division: "Men - Tall (5'11\"+/180cm+)",
            group: "60+",
        },
        {
            url: "EHFZM?a%5B0%5D=JXVBMJ",
            division: "Women - Tall (5'6\"+ / 168cm+)",
            group: "-40",
        },
        {
            url: "EHFZM?a%5B0%5D=RPHWAE",
            division: "Women - Tall (5'6\"+ / 168cm+)",
            group: "40-49",
        },
        {
            url: "EHFZM?a%5B0%5D=KYKGYV",
            division: "Women - Tall (5'6\"+ / 168cm+)",
            group: "50-59",
        },
        {
            url: "EHFZM?a%5B0%5D=NCAWGV",
            division: "Women - Tall (5'6\"+ / 168cm+)",
            group: "60+",
        },
        {
            url: "GXTCAK?a%5B0%5D=JXVBMJ",
            division: "Women - Standard (<5'6\" / <168cm)",
            group: "-40",
        },
        {
            url: "GXTCAK?a%5B0%5D=RPHWAE",
            division: "Women - Standard (<5'6\" / <168cm)",
            group: "40-49",
        },
        {
            url: "GXTCAK?a%5B0%5D=KYKGYV",
            division: "Women - Standard (<5'6\" / <168cm)",
            group: "50-59",
        },
        {
            url: "GXTCAK?a%5B0%5D=NCAWGV",
            division: "Women - Standard (<5'6\" / <168cm)",
            group: "60+",
        },
        {
            url: "BPSZKP?a%5B0%5D=JXVBMJ",
            division: "Men - Standard (<5'11 / <180cm)",
            group: "-40",
        },
        {
            url: "BPSZKP?a%5B0%5D=RPHWAE",
            division: "Men - Standard (<5'11 / <180cm)",
            group: "40-49",
        },
        {
            url: "BPSZKP?a%5B0%5D=KYKGYV",
            division: "Men - Standard (<5'11 / <180cm)",
            group: "50-59",
        },
        {
            url: "BPSZKP?a%5B0%5D=NCAWGV",
            division: "Men - Standard (<5'11 / <180cm)",
            group: "60+",
        },
    ];

    (async () => {
        const browser = await puppeteer.launch({
            args: ["--no-sandbox", "--disable-setuid-sandbox"],
        });
        const page = await browser.newPage();
        page.setViewport({ width: 1200, height: 8000 });

        for (var scrapePage of toScrape) {
            console.log(`Scraping ${urlBase}${scrapePage.url}...`);
            await page.goto(`${urlBase}${scrapePage.url}`);
            await page.waitForSelector(".leaderboard-item--body");

            await grabData(page, scrapePage, data);
            /* await page.evaluate(() => {
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

            await grabData(page, scrapePage, data); */
        }

        /* let uniqueRecord = [];
        data.athletes = data.athletes.reduce((accumulator, current) => {
            if (
                uniqueRecord.indexOf(current.name + "-" + current.category) < 0
            ) {
                uniqueRecord.push(current.name + "-" + current.category);
                accumulator.push(current);
            }
            return accumulator;
        }, []); */

        data.scrapedAt = new Date();

        await fs.ensureDirSync("./public/json");

        await fs.writeFileSync(
            "./public/json/rowd-royalty-2023.json",
            JSON.stringify(data)
        );

        console.log("Scrape Complete");

        await browser.close();
    })();
};

async function grabData(page, scrapePage, data) {
    let newData = await page.$$eval(
        ".leaderboard-item--body",
        (items, scrapePage) => {
            return items.map((item) => {
                return {
                    name: item
                        .querySelector(".leaderboard-item__name")
                        ?.textContent.trim()
                        .replace("  ", " "),
                    score1A: item
                        .querySelectorAll(
                            ".leaderboard-item__score--workout"
                        )?.[0]
                        ?.textContent.trim(),
                    score1B: item
                        .querySelectorAll(
                            ".leaderboard-item__score--workout"
                        )?.[1]
                        ?.textContent.trim(),

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
                    score2C: item
                        .querySelectorAll(
                            ".leaderboard-item__score--workout"
                        )[4]
                        .textContent.trim(),
                    score3A: item
                        .querySelectorAll(
                            ".leaderboard-item__score--workout"
                        )[5]
                        .textContent.trim(),
                    score4A: item
                        .querySelectorAll(
                            ".leaderboard-item__score--workout"
                        )[7]
                        .textContent.trim(),
                    score4B: item
                        .querySelectorAll(
                            ".leaderboard-item__score--workout"
                        )[8]
                        .textContent.trim(),
                    score4C: item
                        .querySelectorAll(
                            ".leaderboard-item__score--workout"
                        )[6]
                        .textContent.trim(),
                    category: scrapePage.division,
                    subCategory: scrapePage.group,
                };
            });
        },
        scrapePage
    );

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
