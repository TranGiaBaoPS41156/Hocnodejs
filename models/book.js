const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

// Định nghĩa Schema cho Sach
const bookSchema = new Schema({
  id: { type: ObjectId }, // khóa chính
  tenSach: { type: String, required: true }, 
  tacGia: { type: String, required: true },  
  theLoai: { type: String, required: true }, 
  gia: { type: Number, required: true },     
  soLuong: { type: Number, required: true }, 
});

module.exports = mongoose.models.book || mongoose.model("book", bookSchema);
