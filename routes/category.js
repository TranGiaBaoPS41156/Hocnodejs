var express = require("express");
var router = express.Router();

var modelProduct = require("../models/category");
/* GET home page. */
router.get("/all", async function (req, res, next) {
  try {
    var data = await modelProduct.find();
    res.status(200).json(data);
  } catch (err) {
    res.json.status(400).json({ message: err });
  }
});
module.exports = router;
