fetch("../json/scrape.json")
  .then(function (response) {
    return response.json();
  })
  .then(function (j) {
    let now = new Date();
    let then = new Date(j.scrapedAt);

    let timeDiff = new Date(now - then).toISOString().slice(11, 19);

    console.log(timeDiff);
    console.table(j.athletes);
  });
