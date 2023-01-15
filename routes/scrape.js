var express = require("express");
var router = express.Router();

var scraper = require("../scraper/scrape-rowd-royalty-2023");

/* GET users listing. */
router.get("/", function (req, res, next) {
    scraper();
    res.send("Row Series Data Updated");
});

module.exports = router;
