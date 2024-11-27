const express = require("express");
const router = express.Router();
const Sach = require("../models/book"); // Import model Sach
const JWT = require("jsonwebtoken");
const config = require("../util/tokenConfig");
const upload = require("../util/Upload");


// Middleware kiểm tra JWT
function verifyToken(req, res, next) {
  try {
    const token = req.header("Authorization").split(" ")[1];
    if (token) {
      JWT.verify(token, config.SECRETKEY, (err) => {
        if (err) {
          return res.status(403).json({ status: false, message: "Token không hợp lệ" });
        }
        next();
      });
    } else {
      res.status(401).json({ status: false, message: "Chưa xác thực" });
    }
  } catch (err) {
    res.status(400).json({ status: false, message: "Có lỗi xảy ra" });
  }
}

// 1. Lấy danh sách tất cả sách
router.get("/all", verifyToken, async (req, res) => {
  try {
    const sachList = await Sach.find();
    res.status(200).json(sachList);
  } catch (err) {
    res.status(400).json({ status: false, message: err.message });
  }
});

// 2. Lấy sách thuộc thể loại cụ thể
router.get("/theloai/:theLoai", async (req, res) => {
  try {
    const sachList = await Sach.find({ theLoai: req.params.theLoai });
    res.status(200).json(sachList);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 3. Tìm sách có giá trong khoảng
router.get("/gia", async (req, res) => {
  try {
    const { min = 0, max = 100000 } = req.query; // Mặc định khoảng giá
    const sachList = await Sach.find({ gia: { $gte: min, $lte: max } });
    res.status(200).json(sachList);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 4. Tìm sách theo tên
router.get("/detail/:tenSach", async (req, res) => {
  try {
    const sach = await Sach.findOne({ tenSach: req.params.tenSach });
    if (sach) {
      res.status(200).json(sach);
    } else {
      res.status(404).json({ message: "Không tìm thấy sách" });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 5. Thêm sách mới
router.post("/add", async (req, res) => {
  try {
    const { tenSach, tacGia, theLoai, gia, soLuongTon } = req.body;
    const newSach = new Sach({ tenSach, tacGia, theLoai, gia, soLuongTon });
    await newSach.save();
    res.status(201).json({ status: true, message: "Thêm sách thành công" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 6. Sửa thông tin sách
router.put("/edit/:id", async (req, res) => {
  try {
    const { tenSach, tacGia, theLoai, gia, soLuongTon } = req.body;
    const sach = await Sach.findById(req.params.id);

    if (sach) {
      sach.tenSach = tenSach || sach.tenSach;
      sach.tacGia = tacGia || sach.tacGia;
      sach.theLoai = theLoai || sach.theLoai;
      sach.gia = gia || sach.gia;
      sach.soLuongTon = soLuongTon || sach.soLuongTon;

      await sach.save();
      res.status(200).json({ status: true, message: "Cập nhật sách thành công" });
    } else {
      res.status(404).json({ status: false, message: "Không tìm thấy sách" });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 7. Xóa sách theo ID
router.delete("/delete/:id", async (req, res) => {
  try {
    const sach = await Sach.findByIdAndDelete(req.params.id);
    if (sach) {
      res.status(200).json({ status: true, message: "Xóa sách thành công" });
    } else {
      res.status(404).json({ message: "Không tìm thấy sách" });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 8. Lấy sách có giá cao nhất
router.get("/max-gia", async (req, res) => {
  try {
    const sach = await Sach.findOne().sort({ gia: -1 });
    res.status(200).json(sach);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 9. Lấy sách có số lượng tồn ít nhất
router.get("/min-stock", async (req, res) => {
  try {
    const sach = await Sach.findOne().sort({ soLuongTon: 1 });
    res.status(200).json(sach);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 10. Tải ảnh bìa sách
router.post("/upload", [upload.single("image")], async (req, res) => {
  try {
    const { file } = req;
    if (!file) {
      return res.json({ status: 0, link: "" });
    } else {
      const url = `http://localhost:3000/images/${file.filename}`;
      return res.json({ status: 1, url: url });
    }
  } catch (error) {
    console.log("Upload image error: ", error);
    return res.json({ status: 0, link: "" });
  }
});

// Export router
module.exports = router;
