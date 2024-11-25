const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: 'trangiabao22172005@gmail.com',
      pass: 'sjti hwol hwyj cvwe'
    }
  });
  module.exports = { transporter };