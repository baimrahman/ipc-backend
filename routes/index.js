var express = require("express");
var router = express.Router();

var index = import("../public.index.html");
/* GET home page. */
router.get("/", function (req, res, next) {
  res.render(index);
});

module.exports = router;
