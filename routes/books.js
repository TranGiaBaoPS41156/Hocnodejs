const express = require("express");
const router = express.Router();
const Book = require("../models/book");

// **[1] Lấy danh sách toàn bộ sách**
router.get("/all", async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).json(books);
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi lấy danh sách sách: " + err });
  }
});

// **[2] Lấy thông tin sách theo Mã sách**
router.get("/detail/:MaSach", async (req, res) => {
  try {
    const book = await Book.findOne({ MaSach: req.params.MaSach });
    if (book) {
      res.status(200).json(book);
    } else {
      res.status(404).json({ message: "Sách không tồn tại" });
    }
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi tìm sách: " + err });
  }
});

// **[3] Thêm mới một cuốn sách**
router.post("/add", async (req, res) => {
  try {
    const { MaSach, TenSach, TacGia, TheLoai, Gia, SoLuongTon } = req.body;
    const newBook = new Book({ MaSach, TenSach, TacGia, TheLoai, Gia, SoLuongTon });
    await newBook.save();
    res.status(201).json({ message: "Thêm sách thành công" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi thêm sách: " + err });
  }
});

// **[4] Cập nhật thông tin sách**
router.put("/edit/:MaSach", async (req, res) => {
  try {
    const { TenSach, TacGia, TheLoai, Gia, SoLuongTon } = req.body;
    const book = await Book.findOne({ MaSach: req.params.MaSach });
    if (book) {
      book.TenSach = TenSach || book.TenSach;
      book.TacGia = TacGia || book.TacGia;
      book.TheLoai = TheLoai || book.TheLoai;
      book.Gia = Gia || book.Gia;
      book.SoLuongTon = SoLuongTon || book.SoLuongTon;

      await book.save();
      res.status(200).json({ message: "Cập nhật sách thành công" });
    } else {
      res.status(404).json({ message: "Sách không tồn tại" });
    }
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi cập nhật sách: " + err });
  }
});

// **[5] Xóa sách theo Mã sách**
router.delete("/delete/:MaSach", async (req, res) => {
  try {
    const book = await Book.findOneAndDelete({ MaSach: req.params.MaSach });
    if (book) {
      res.status(200).json({ message: "Xóa sách thành công" });
    } else {
      res.status(404).json({ message: "Sách không tồn tại" });
    }
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi xóa sách: " + err });
  }
});

// **[6] Lấy danh sách sách theo Thể loại**
router.get("/category/:TheLoai", async (req, res) => {
  try {
    const books = await Book.find({ TheLoai: req.params.TheLoai });
    res.status(200).json(books);
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi lấy sách theo thể loại: " + err });
  }
});

// **[7] Lấy sách có giá lớn hơn một mức giá nhất định**
router.get("/price/above/:Gia", async (req, res) => {
  try {
    const books = await Book.find({ Gia: { $gte: req.params.Gia } });
    res.status(200).json(books);
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi lấy sách: " + err });
  }
});

// **[8] Lấy sách có số lượng tồn ít hơn 10**
router.get("/low-stock", async (req, res) => {
  try {
    const books = await Book.find({ SoLuongTon: { $lt: 10 } });
    res.status(200).json(books);
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi lấy sách tồn kho thấp: " + err });
  }
});

// **[9] Sắp xếp sách theo giá giảm dần**
router.get("/sorted-price", async (req, res) => {
  try {
    const books = await Book.find().sort({ Gia: -1 });
    res.status(200).json(books);
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi sắp xếp sách: " + err });
  }
});

// **[10] Lấy sách đắt nhất**
router.get("/highest-price", async (req, res) => {
  try {
    const book = await Book.findOne().sort({ Gia: -1 });
    res.status(200).json(book);
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi lấy sách đắt nhất: " + err });
  }
});

module.exports = router;
