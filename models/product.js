const mongoose = require("mongoose");
const category = require("./category");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const Product = new Schema({
  id: { type: ObjectId }, // khóa chính
  tensp: { type: String },
  gia: { type: String },
  soluong: { type: String },
  category: { type: ObjectId, ref: "category" },
});

module.exports = mongoose.models.Product || mongoose.model("product", Product);
