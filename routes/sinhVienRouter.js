const express = require("express");
const router = express.Router();
var  upload = require("../util/Upload"); 
const SinhVien = require("../models/sinhvien");
var sendMail = require("../util/email");
const JWT = require('jsonwebtoken');
const config = require("../util/tokenConfig");

// Lấy toàn bộ danh sách sinh viênSs
router.get("/all", async function (req, res) {
  try {
    // token
    const token = req.header("Authorization").split(' ')[1];
  if(token){
    JWT.verify(token, config.SECRETKEY, async function (err, id){
      if(err){
        res.status(403).json({"status": false, message : "XAY RA LOI: " + err});
      }else{
        //xử lý chức năng tương ứng với API
        const sinhviens = await SinhVien.find();
    res.status(200).json(sinhviens);
      }
    });
  }else{
    res.status(401).json({"status": false , message :"khong xax thuc"});
  }
  } catch (err) {
    res.status(400).json({ "status": false , message :"khong xax thuc" + err });
  }
});

// Lấy toàn bộ danh sách sinh viên thuộc khoa CNTT
router.get("/cntt", async function (req, res) {
  try {
    const sinhviens = await SinhVien.find({ BoMon: "CNTT" });
    res.status(200).json(sinhViens);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Lấy danh sách sinh viên có điểm trung bình từ 6.5 đến 8.5
router.get("/dtb", async function (req, res) {
  try {
    const sinhviens = await SinhVien.find({ DTB: { $gte: 6.5, $lte: 8.5 } });
    res.status(200).json(sinhViens);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Tìm kiếm thông tin của sinh viên theo MSSV
router.get("/detail/:mssv", async function (req, res) {
  try {
    const sinhvien = await SinhVien.findOne({ MSSV: req.params.mssv });
    if (sinhvien) {
      res.status(200).json(sinhvien);
    } else {
      res.status(404).json({ message: "Sinh viên không tồn tại" });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Thêm mới một sinh viên
router.post("/add", async function (req, res) {
  try {
    const { MSSV, HoTen, DTB, BoMon, Tuoi } = req.body;
    const newSinhVien = new SinhVien({ MSSV, HoTen, DTB, BoMon, Tuoi });
    await newSinhVien.save();
    res.status(201).json({ status: true, message: "Thêm sinh viên thành công" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Sửa thông tin sinh viên theo MSSV
router.put("/edit/:mssv", async function (req, res) {
  try {
    const { MSSV, HoTen, DTB, BoMon, Tuoi } = req.body;
    const sinhVien = await SinhVien.findOne({ MSSV: req.params.mssv });

    if (sinhVien) {
      sinhVien.MSSV = MSSV || sinhVien.MSSV;
      sinhVien.HoTen = HoTen || sinhVien.HoTen;
      sinhVien.DTB = DTB || sinhVien.DTB;
      sinhVien.BoMon = BoMon || sinhVien.BoMon;
      sinhVien.Tuoi = Tuoi || sinhVien.Tuoi;

      await sinhVien.save();
      res.status(200).json({ status: true, message: "Sửa sinh viên thành công" });
    } else {
      res.status(404).json({ status: false, message: "Sinh viên không tồn tại" });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Xóa một sinh viên theo MSSV
router.delete("/delete/:mssv", async function (req, res) {
  try {
    const sinhVien = await SinhVien.findOneAndDelete({ MSSV: req.params.mssv });
    if (sinhVien) {
      res.status(200).json({ status: true, message: "Xóa sinh viên thành công" });
    } else {
      res.status(404).json({ message: "Sinh viên không tồn tại" });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Lấy danh sách sinh viên thuộc BM CNTT và có DTB từ 9.0
router.get("/cntt-dtb9", async function (req, res) {
  try {
    const sinhViens = await SinhVien.find({ BoMon: "CNTT", DTB: { $gte: 9.0 } });
    res.status(200).json(sinhViens);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Lấy danh sách sinh viên tuổi từ 18 đến 20 thuộc CNTT và có DTB từ 6.5
router.get("/cntt-age18to20-dtb6.5", async function (req, res) {
  try {
    const sinhViens = await SinhVien.find({
      BoMon: "CNTT",
      Tuoi: { $gte: 18, $lte: 20 },
      DTB: { $gte: 6.5 },
    });
    res.status(200).json(sinhViens);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Sắp xếp danh sách sinh viên tăng dần theo DTB
router.get("/sorted-dtb", async function (req, res) {
  try {
    const sinhViens = await SinhVien.find().sort({ DTB: 1 });
    res.status(200).json(sinhViens);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Tìm sinh viên có DTB cao nhất thuộc BM CNTT
router.get("/cntt-maxdtb", async function (req, res) {
  try {
    const sinhVien = await SinhVien.findOne({ BoMon: "CNTT" }).sort({ DTB: -1 });
    res.status(200).json(sinhVien);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// up load file
router.post("/upload", [upload.single("image")], async (req, res, next) => {
  try {
    const { file } = req;
    if (!file) {
      return res.json({ status: 0, link: "" });
    } else {
      const url = `http://http://localhost:3000//images/${file.filename}`;
      return res.json({ status: 1, url: url });
    }
  } catch (error) { 
    console.log("Upload image error: ", error);
    return res.json({ status: 0, link: "" });
  }
});
// gui email
router.post("/send-mail", async function(req, res, next){
  try{
    const {to, subject, content} = req.body;

    const mailOptions = {
      from: "giabao <trangiabao22172005@gmail.com>",
      to: to,
      subject: subject,
      html: content
    };
    await sendMail.transporter.sendMail(mailOptions);
    res.json({ status: 1, message: "Gửi mail thành công"});
  }catch(err){
    res.json({ status: 0, message: "Gửi mail thất bại"});
  }
});
module.exports = router;
