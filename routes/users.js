var express = require("express");
var router = express.Router();
const JWT = require('jsonwebtoken');
const config = require("../util/tokenConfig");
var User = require("../models/User");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a rdasdesource");
});

router.post("/login", async function(rep, res) {
  try{
    const { username , password } = rep.body;
    const checkUser =  await  User.findOne({username: username , password: password});
    console.log(checkUser);
    if( checkUser == null){
       res.status(200).json({status: false , message : "USERNAME OR PASSWORRD ERROR"})
    }else{
      const token = JWT.sign({username: username }, config.SECRETKEY ,{expiresIn :'30s'});
      const refreshtoken = JWT.sign({username: username }, config.SECRETKEY ,{expiresIn :'1d'});
      res.status(200).json({status: true , message : "LOGIN THANH CONG", token : token, refreshtoken: refreshtoken})
    }

  }catch(e){
    res.status(400).json({status: false , message : "XAY RA LOI"})
  }
});
module.exports = router;
