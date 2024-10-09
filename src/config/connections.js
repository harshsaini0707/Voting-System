const mongoose = require("mongoose");

const ConnectDB =  async ()=>{
     mongoose.connect("mongodb+srv://HarshSaini:Ev2NbFd4o5CRPcVS@namaste.oyshp.mongodb.net/Voting")
}

module.exports = {ConnectDB};