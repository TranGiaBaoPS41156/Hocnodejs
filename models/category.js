const mongoose = require("mongoose");
const Schema = mongoose.Schema; // Schema == collection
const ObjectId = Schema.ObjectId;

const category = new Schema({
  id: { type: ObjectId }, // khóa chính
  name: {
    type: String, // kiểu dữ liệu
  },
  description: {
    type: String,
  },
});

module.exports =
  mongoose.models.category || mongoose.model("category", category);
