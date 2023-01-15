var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
    res.send("HEllo");
    res.render("index", { title: "Express" });
});

router.get("/rowseries-2022", function (req, res, next) {
    res.render("rowseries-2022", { title: "Express" });
});

router.get("/rowd-royalty-2023", function (req, res, next) {
    res.render("rowd-royalty-2023", { title: "Express" });
});

module.exports = router;
