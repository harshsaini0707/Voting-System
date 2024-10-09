const express =  require("express");
const { userAuth } = require("../../middleware/auth");
const profileRouter =  express.Router();
const {validateChangeData} =  require("../../utils/validation");
const bcrypt =  require("bcrypt");


profileRouter.get("/profile/view" ,userAuth, async (req, res)=>{

    try {
        const user = req.user;
        if(!user) throw new Error("User not found");
        return res.status(200).json({user})
        
    } catch (error) {
        return res.send("ERROR :"+error.message)
    }
})

profileRouter.patch("/profile/edit",userAuth,  async(req ,  res)=>{
    try {
        
      if(!validateChangeData(req)){
        throw new Error ("You are trying to change that thing which can't be changed now!!")
      }
      const loggedInUser =  req.user;

      Object.keys(req.body).forEach((key)=>{
        loggedInUser[key] = req.body[key];
      })

      await loggedInUser.save();
      return  res.json({loggedInUser})


    } catch (error) {
        return res.send("ERROR :"+error.message)
    }
})

profileRouter.patch("/profile/editPassword",userAuth, async(req, res)=>{
    try {
        const{oldPassword , newPass} =  req.body;
        const user = req.user;
        
        const isOldPassValid =  await user.validatePassword(oldPassword);
        if(!isOldPassValid) return res.json({message : "Invalid Old Password!!"});
        else{
            const hashPass  = await bcrypt.hash(newPass , 10);
            user.password = hashPass;
            await user.save();
            return res.status(200).json({message : "Password Edited Sucessfully!!"})
        }

    } catch (error) {
        return res.send("ERROR :"+error.message)
    }
})
module.exports = {profileRouter}