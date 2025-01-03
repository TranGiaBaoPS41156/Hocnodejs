const express = require("express");
const router = express.Router();
const book = require("../models/book"); // Import model Book
const JWT = require("jsonwebtoken");
const config = require("../util/tokenConfig");
const upload = require("../util/Upload");

/// Middleware xác thực Token
const authenticateToken = (req, res, next) => {
  const authHeader = req.header("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ status: false, message: "Không tìm thấy token hoặc định dạng sai" });
  }

  const token = authHeader.split(" ")[1];
  JWT.verify(token, config.SECRETKEY, (err, decoded) => {
    if (err) {
      return res
        .status(403)
        .json({ status: false, message: "Token không hợp lệ hoặc hết hạn" });
    }
    req.user = decoded; // Lưu thông tin user từ token (nếu cần)
    next();
  });
};

// 1. Lấy toàn bộ danh sách
router.get("/all", authenticateToken, async (req, res) => {
  try {
    const list = await book.find();
    res.status(200).json(list);
  } catch (e) {
    res
      .status(500)
      .json({ status: false, message: "Có lỗi xảy ra: " + e.message });
  }
});

// 2. Lấy sách thuộc thể loại cụ thể
router.get("/theloai/:theLoai", authenticateToken, async (req, res) => {
  try {
    const bookList = await book.find({ theLoai: req.params.theLoai });
    res.status(200).json(bookList);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 3. Tìm sách có giá trong khoảng
router.get("/gia", authenticateToken, async (req, res) => {
  try {
    const { min = 0, max = 100000 } = req.query;
    const bookList = await book.find({ gia: { $gte: min, $lte: max } });
    res.status(200).json(bookList);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 4. Tìm sách theo tên
router.get("/detail/:tenSach", authenticateToken, async (req, res) => {
  try {
    const sach = await book.findOne({ tenSach: req.params.tenSach });
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
router.post("/add", authenticateToken, async (req, res) => {
  try {
    const { tenSach, tacGia, theLoai, gia, soLuongTon } = req.body;
    const newbook = new book({ tenSach, tacGia, theLoai, gia, soLuongTon });
    await newbook.save();
    res.status(201).json({ status: true, message: "Thêm sách thành công" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 6. Sửa thông tin sách
router.put("/edit/:id", authenticateToken, async (req, res) => {
  try {
    const { tenSach, tacGia, theLoai, gia, soLuongTon } = req.body;
    const sach = await book.findById(req.params.id);

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
router.delete("/delete/:id", authenticateToken, async (req, res) => {
  try {
    const sach = await book.findByIdAndDelete(req.params.id);
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
router.get("/max-gia", authenticateToken, async (req, res) => {
  try {
    const sach = await book.findOne().sort({ gia: -1 });
    if (sach) {
      res.status(200).json(sach);
    } else {
      res.status(404).json({ message: "Không có sách nào" });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 9. Lấy sách có số lượng tồn ít nhất
router.get("/min-stock", authenticateToken, async (req, res) => {
  try {
    const sach = await book.findOne().sort({ soLuongTon: 1 });
    if (sach) {
      res.status(200).json(sach);
    } else {
      res.status(404).json({ message: "Không có sách nào" });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 10. Tải ảnh bìa sách
router.post("/upload", [authenticateToken, upload.single("image")], async (req, res) => {
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

module.exports = router;
