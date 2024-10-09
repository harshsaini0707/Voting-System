const express =  require("express")
const app = express();
const {ConnectDB} = require("./config/connections");
const cookieParser = require("cookie-parser");
const{userRouter} =  require("./routes/auth");
const {profileRouter} =  require("./routes/profile");
const bodyParser = require("body-parser");

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());


app.use("/",userRouter );
app.use("/" , profileRouter)

ConnectDB().then(()=>{
    
    console.log("DB Connection Made Successfully!!");
    app.listen(8888,()=>{
        console.log("Server Started Successfully!!");
    })
}).catch((err)=>{
    console.log(`ERROR: ${err}`);

})