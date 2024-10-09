const express= require("express");
const jwt = require("jsonwebtoken");
const { User } = require("../models/user");
const cookieParser = require("cookie-parser");

const userAuth =  async (req,res,next) =>{
  
    try {

  const cookie = req.cookies;
  const token = cookie?.userToken;
  if(!token) return res.status(400).json({message : "Invalid Token"})

  const decodedToken = await jwt.verify(token, "Voting@253");
  const {_id} =  decodedToken;
  const user = await User.findById(_id);
  if(!user) return res.json({message : "User not found!!"})
  req.user = user;
  next();
        
    } catch (error) {
        return res.send("ERROR :"+error.message)
        
    }

}

module.exports = {userAuth};