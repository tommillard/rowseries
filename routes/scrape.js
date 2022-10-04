var express = require("express");
var router = express.Router();

var scraper = require("../scraper/scraper");

/* GET users listing. */
router.get("/", function (req, res, next) {
  scraper();
  res.send("respond with a resource");
});

module.exports = router;
