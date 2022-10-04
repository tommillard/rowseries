fetch("../json/scrape.json")
  .then(function (response) {
    return response.json();
  })
  .then(function (j) {
    console.log(j.scrapedAt);
    console.table(j.athletes);
  });
