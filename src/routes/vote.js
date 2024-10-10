const express = require("express");
const { userAuth } = require("../../middleware/auth");
const { User } = require("../../models/user");
const { candidateModel } = require("../../models/candidate");
const voteRouter = express.Router();
const {isVoter} = require("../../utils/validation")

voteRouter.post("/vote/:candidateId" , userAuth , async (req,res)=>{
    try {
        const user  = req.user;
        const candidateId = req.params.candidateId;
        const candidate = await candidateModel.findById(candidateId);
        if(!candidate) return res.status(400).json({message : "Not a candidadate!!"})
        if(! await isVoter(user)) return res.status(400).json({message : "You are not eligible Voter!!"})
        if(!user.isVoted){
         candidate.voteCount++;
         candidate.votes.push({user : user._id})
         await candidate.save();

         user.isVoted = true
         await user.save();
         return res.status(200).json({message:"Voting Done Sucessfulyy!!"})

        }else{
            return res.status(404).json({message : "You cannot Vote Again!!"})
        }
              
    } catch (error) {
        return res.status(400).json({ ERROR: error.message });
    }
})


voteRouter.get("/vote/count" ,  async(req , res )=>{
    try {
        const  candidateRecord =await candidateModel.find({}).sort({voteCount : "desc"}).select("voteCount ,firstName , lastName , party")
        return res.status(400).json(candidateRecord)
        
    } catch (error) {
        return res.status(400).json({ ERROR: error.message });
    }
})


module.exports= {voteRouter};