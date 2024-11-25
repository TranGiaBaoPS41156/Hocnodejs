var express = require("express");
var router = express.Router();

var modelProduct = require("../models/product");

const JWT = require('jsonwebtoken');
const config = require("../util/tokenConfig"); 

// Lấy tất cả danh sách sản phẩm
router.get("/all", async function (req, res, next) {
  try {
//token
    const token = req.header("Authorization").split(' ')[1];
    if(token){
      JWT.verify(token, config.SECRETKEY, async function (err, id){
        if(err){
          res.status(403).json({"status": false, message: "Co loi xay ra: " + err});
        }else{
          //xử lý chức năng tương ứng với API
          var list = await modelProduct.find().populate("category");
           res.status(200).json(data);
        }
      });
    }else{
      res.status(401).json({"status": false, message : "khong xac thuc"});
    }
    
  } catch (err) {
    res.json.status(400).json({ message: err });
  }
});

// Lấy danh sách tất cả các sản phẩm có số lượng lớn hơn 20
// http://localhost:3000/products/sl?soluong=20
router.get("/sl", async function (req, res, next) {
  try {
    // token
    const token = req.header("Authorization").split(' ')[1];
    if(token){
      JWT.verify(token, config.SECRETKEY, async function (err, id){
        if(err){
          res.status(403).json({"status": false, "err": err});
        }else{
          //xử lý chức năng tương ứng với API
          const { soluong } = req.query;
          var data = await modelProduct.find({ soluong: { $gt: soluong } });
          res.status(200).json(data);
        }
      });
    }else{
      res.status(401).json({"status": false, message : "khong xac thuc"});
    } 
  } catch (e) {
    res.status(400).json({ message: err });
  }
});

// Lấy danh sách sản phẩm có giá từ 20000 đến 50000
// http://localhost:3000/products/gia?min=20000&max=50000
router.get("/gia", async function (req, res, next) {
  try {
       // token
    const token = req.header("Authorization").split(' ')[1];
    if(token){
      JWT.verify(token, config.SECRETKEY, async function (err, id){
        if(err){
          res.status(403).json({"status": false, "err": err});
        }else{
          //xử lý chức năng tương ứng với API
          const { min, max } = req.query;
          var data = await modelProduct.find({ gia: { $gt: min, $lt: max } });
          res.status(200).json(data);
        }
      });
    }else{
      res.status(401).json({"status": false, message : "khong xac thuc"});
    } 


    
  } catch (e) {
    res.status(400).json({ message: err });
  }
});

//  Lấy danh sách sản phẩm có số lượng nhỏ hơn 10 hoặc giá lớn hơn 15000
//http://localhost:3000/products/slgia?soluong=10&gia=15000
router.get("/slgia", async function (req, res, next) {
  try {
         // token
    const token = req.header("Authorization").split(' ')[1];
    if(token){
      JWT.verify(token, config.SECRETKEY, async function (err, id){
        if(err){
          res.status(403).json({"status": false, "err": err});
        }else{
          //xử lý chức năng tương ứng với API
          const { soluong, gia } = req.query;
          var data = await modelProduct.find({
            $or: [{ soluong: { $lt: soluong } }, { gia: { $gt: gia } }],
          });
          res.status(200).json(data);
        }
      });
    }else{
      res.status(401).json({"status": false, message : "khong xac thuc"});
    } 
   
  } catch (e) {
    res.status(400).json({ message: err });
  }
});

// Lấy thông tin chi tiết
// http://localhost:3000/products/detail/6730a9bac664e7db54a2b946
router.get("/detail/:id", async function (req, res, next) {
  try {
         // token
    const token = req.header("Authorization").split(' ')[1];
    if(token){
      JWT.verify(token, config.SECRETKEY, async function (err, id){
        if(err){
          res.status(403).json({"status": false, "err": err});
        }else{
          //xử lý chức năng tương ứng với API
          const { id } = req.params;
          var data = await modelProduct.findById(id);
          res.status(200).json(data);
        }
      });
    }else{
      res.status(401).json({"status": false, message : "khong xac thuc"});
    } 



  } catch (e) {
    res.status(400).json({ message: err });
  }
});

// thêm dữ liệu
router.post("/add", async function (req, res) {
  try {
    const { tensp, gia, soluong } = req.body;
    const newProduct = { tensp, gia, soluong };
    await modelProduct.create(newProduct);
    res.status(200).json({ status: true, message: "Thêm sản phẩm thành công" });
  } catch (e) {
    res.status(400).json({ message: err });
  }
});
// sửa dữ liệu
router.put("/edit", async function (req, res) {
  try {
    const { id, tensp, gia, soluong } = req.body;
    // tim san pham can sua
    const findProduct = await modelProduct.findById(id);

    if (findProduct) {
      findProduct.tensp = tensp ? tensp : findProduct.tensp;
      findProduct.gia = gia ? gia : findProduct.gia;
      findProduct.soluong = soluong ? soluong : findProduct.soluong;
      await findProduct.save();
      res
        .status(200)
        .json({ status: true, message: "Sửa sản phẩm thành công" });
    } else {
      res
        .status(400)
        .json({ status: false, message: "Không tìm thấy sản phẩm" });
    }
  } catch (e) {
    res.status(400).json({ message: err });
  }
});

// xoa du lieu
router.delete("/delete:id", async function (req, res) {
  try {
    const { id } = req.params;
    const findProduct = await modelProduct
      .findById(id)
      .then((data) => data.remove());
    if (findProduct) {
      res
        .status(200)
        .json({ status: true, message: "Xóa sản phẩm thành công" });
    }
  } catch (e) {
    res.status(400).json({ message: err });
  }
});


module.exports = router;
