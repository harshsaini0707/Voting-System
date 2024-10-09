const validator = require("validator");


const validateSignUpData = async(req) =>{
   
    const{firstName , email , password , age} = req.body;

    if(!firstName) throw new Error("FirstName Requied!!")
    if(age < 18) throw new Error("Not Eligible for Vote!!")

   if(!validator.isEmail(email)){
     throw new Error("Email not valid")
   }
   

}

const validateChangeData = async (req) =>{
  
  const allowedChanged = ["firstName" ,  "lastName" ,  "email"  , "mobile" , "gender"];

  const isEditAllowed = Object.keys(req.body).every((k)=>{
    return allowedChanged.includes(k);
  })
  return isEditAllowed;
}

module.exports = {validateSignUpData ,  validateChangeData}