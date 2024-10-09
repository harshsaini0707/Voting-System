const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt =  require("bcrypt");
const jwt = require("jsonwebtoken")

const userSchema = new mongoose.Schema({
 
    firstName:{
        type :  String,
        required : true,
        minLength : 2,
        maxLength : 30
    },
    lastName:{
        type:String,
        maxLength:30
    },
    age:{
        type:Number,
        required : true,
        min:18
    },
    mobile:{
        type:Number,
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid Email type")
            }
        }
    },
    gender:{
        type: String,
        lowercase: true,
        validate(value){
            if(!["male" , "female" ,  "other"].includes(value)){
                throw new Error("Invalid Gender!!")
            }
        }
    },
    password:{
        type:String,
        required:true
    },
    adharCard:{
        type:Number,
        unique:true,
        required:true
    },
    role:{
        type:String,
        enum:{
            values:["voter", "admin"],
            message: "${VALUE} is incorrect role type"
        }
    },
    isVoted:{
        type:Boolean,
        default:false
    },
    votes:[
        {
            user:{
                type : mongoose.Schema.Types.ObjectId,
                ref: "User",
                required : true
            },
            votedAt:{
                type: Date,
                default : Date.now()
            }
        }
    ],
    voteCount:{
        type:Number,
        default : 0
    }

},{timestamps :  true});

userSchema.methods.validatePassword = async function (passwordInputByUser) {
    const user = this;
    const passwordHash = user.password;
    const isPasswordValid = await bcrypt.compare(passwordInputByUser,passwordHash);
    return isPasswordValid;
}

userSchema.methods.getJWT = async function(){
    const user = this;
    const token =  await jwt.sign({_id: user.id} , "Voting@253" , {expiresIn : "1d"})
    return token;
}

const User =  new mongoose.model("User", userSchema);

module.exports = {User};