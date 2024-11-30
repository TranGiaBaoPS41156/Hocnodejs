const mongoose = require("mongoose");
const Schema = mongoose.Schema; // Schema == collection
const ObjectId = Schema.ObjectId;
const user = new Schema({
  id: { type: ObjectId }, // khóa chính
  username: {
    type: String, // kiểu dữ liệu
  },
  password: {
    type: String,
  },
  fullName: {
    type: String,
  },
});
module.exports = mongoose.models.user || mongoose.model("user", user);
// category -----> categories
