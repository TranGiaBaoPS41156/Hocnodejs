const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mongoose = require("mongoose");

// Import models
require("./models/User");
require("./models/product");
require("./models/category");
require("./models/sinhvien");
require("./models/book");

// Import routes
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const test = require("./routes/test");

const Category = require("./routes/category");
const sinhVienRouter = require("./routes/sinhVienRouter"); // Route cho sinh viên
const book = require("./routes/books");

// Kết nối MongoDB
mongoose
  .connect("mongodb+srv://baotgps41156:Baogt8213%40ps41156@cluster0.ca8kl.mongodb.net/md19302")
  .then(() => console.log(">>>>>>>>>> DB Connected!!!!!!"))
  .catch((err) => console.log(">>>>>>>>> DB Error: ", err));

const app = express();

// Cấu hình view engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Định tuyến
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/test", test);
 
app.use("/category", Category);
app.use("/sinhvien", sinhVienRouter); // Sử dụng route cho sinh viên
app.use("/book", book);

// Xử lý lỗi 404
app.use(function (req, res, next) {
  next(createError(404));
});

// Xử lý lỗi khác
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
