const express =  require("express");
const { userAuth } = require("../../middleware/auth");
const candidateRoute = express.Router();
const {IsAdmin} =  require("../../utils/validation");
const { candidateModel } = require("../../models/candidate");

candidateRoute.post("/admin/addCandidate", userAuth , async (req, res) =>{
    try {
        const user = req.user;
        if(! await IsAdmin(user)) return res.status(404).json({message : "Not a Admin"})
        
         const {firstName ,  lastName ,  age , motive , party } =  req.body;
         const candidate = new candidateModel({
            firstName , lastName , age , motive , party
         })

        const data = await candidate.save();
         return res.status(200).json({message :  data})
    
        
        
    } catch (error) {
        return res.status(400).json({ ERROR: error.message });
    }
})

candidateRoute.patch("/admin/edit/:candidateId" , userAuth , async (req,res)=>{
    try {
        const loggedInCandidate = req.user;
        if(! await IsAdmin(loggedInCandidate)) return res.status(404).json({message : "Not a Admin"})
        
        const candidateId = req.params.candidateId;
        const data = req.body;
        const Present =  await candidateModel.findByIdAndUpdate(candidateId ,data ,{
            runValidators : true

        });
        if(!Present) return res.status(400).json({message : "Candidate not present!!"})
         
      await Present.save();

      return res.status(200).json({message : "Edited Successfully!!", loggedInCandidate})
    } catch (error) {
        return res.status(400).json({ ERROR: error.message }); 
    }
})

candidateRoute.delete("/admin/deleteCandidate/:Id" , userAuth , async (req,res)=>{
    try {
        const loggedInCandidate = req.user;
        if(! await IsAdmin(loggedInCandidate)) return res.status(404).json({message : "Not a Admin"});
        
        const Id = req.params.Id;
        const Candidate = await candidateModel.findByIdAndDelete(Id);
        if(!Candidate) return res.json(400).json({message : "Not A Candidate!!"})
        return res.status(200).json({message : "Deleted Sucessfull!!"})
        
    } catch (error) {
        return res.status(400).json({ ERROR: error.message });  
    }
})

module.exports = {candidateRoute}