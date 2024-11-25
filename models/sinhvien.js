const mongoose = require("mongoose");
const Schema = mongoose.Schema; // Schema == collection
const ObjectId = Schema.ObjectId;

const sinhVienSchema = new Schema({
  id: { type: ObjectId }, // khóa chính
  MSSV: {
    type: String,  
    required: true,
    unique: true
  },
  HoTen: {
    type: String, 
    required: true
  },
  DTB: {
    type: Number, 
    required: true
  },
  BoMon: {
    type: String, 
    required: true
  },
  Tuoi: {
    type: Number, 
    required: true
  }
});

module.exports = 
  mongoose.models.SinhVien || mongoose.model("SinhVien", sinhVienSchema);
