var express = require("express");
var router = express.Router();

var modelProduct = require("../models/User");

router.get("/user", async function (req, res, next) {
  var data = await modelProduct.find();
  res.json(data);
});
module.exports = router;
