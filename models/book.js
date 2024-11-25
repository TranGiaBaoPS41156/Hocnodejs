const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

// Định nghĩa Schema cho Sach
const SachSchema = new Schema({
  id: { type: ObjectId }, // khóa chính
  tenSach: { type: String, required: true }, // Tên sách
  tacGia: { type: String, required: true },  // Tác giả
  theLoai: { type: String, required: true }, // Thể loại
  gia: { type: Number, required: true },     // Giá sách (kiểu số thập phân)
  soLuongTon: { type: Number, required: true }, // Số lượng tồn kho
});

module.exports = mongoose.models.Sach || mongoose.model("Sach", SachSchema);