const express = require("express");
const userRouter = express.Router();
const {validateSignUpData} =  require("../../utils/validation");
const bcrypt  = require('bcrypt');
const validator = require("validator");
const jwt = require("jsonwebtoken");

const { User } = require("../../models/user");


userRouter.post("/signup",  async (req,res)=>{
    try {

        validateSignUpData(req);
        const {firstName ,  lastName , age, password , email , adharCard , role} =  req.body;

        const hashPass = await bcrypt.hash(password , 10);
        
        const user = new User({
            firstName , lastName, age,email , adharCard , role ,  password: hashPass
        })
       await user.save();
       return res.status(200).json({data : user})
        
    } catch (error) {
        return res.status(400).json({ ERROR: error.message });
    }
})

userRouter.post("/login" , async(req,res)=>{
    try {
        const{email , password} = req.body;
        if(!validator.isEmail(email)){
            return res.status(400).json({message:"Invalid Email!!"})
        }
        const user  = await User.findOne({email : email});
        if(!user) return res.status(404).json({message:"Invalid Credential!!"})

        const validPassword = await user.validatePassword(password);

        if(validPassword){
            
        const token = await user.getJWT();
        console.log(token);
        
        res.cookie("userToken", token , {httpOnly : true})
        
        
        return res.json({message: "Login Sucessful"})
        }else{
            return res.json({message : "Invalid Credential!!"})
        }

    } catch (error) {
       return res.status(400).json({ ERROR: error.message }); 
    }
})

userRouter.post("/logout", async(req,res) =>{
  res.cookie("userToken" , null , { expires : new Date(Date.now())})
  return res.status(200).json({message : "Logout Sucessfull!!"})
})
module.exports = {userRouter}