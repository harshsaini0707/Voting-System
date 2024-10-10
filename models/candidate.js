const mongoose = require("mongoose");

const candidateSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required: true
    },
    lastName:{
        type:String,
    },
    age:{
        type : Number,
        min : 27,
        required :  true
    },
    party:{
        type:String,
        required :  true,
        unique: true
    },
    motive:{
        type : String,
        default :"Kuch nahi milney wale thumaye vote dheke sirf berozgaari"
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
}, {timestamps:true})

const candidateModel =  new mongoose.model("candidateModel", candidateSchema);
module.exports = {candidateModel}