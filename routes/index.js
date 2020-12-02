const express = require("express");
const router = express.Router();

const index = import("../public.index.html");
/* GET home page. */
router.get("/", function (req, res, next) {
  res.render(index);
});

module.exports = router;
