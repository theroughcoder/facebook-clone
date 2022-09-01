import express from "express";
import path from "path"
import mongoose from "mongoose" 
import dotenv from "dotenv"                 
import userRouter from "./router/userRouter.js"
import cors from 'cors'
// import uploadRouter from "./router/uploadRouter.js" 

let allowed = ['http://localhost:3000','http://postman.com', 'some other link'];
function options(req, res){
    let temp;
    let origin = req.header('origin');
    if(allowed.indexOf(origin) > -1){
        temp ={
            origin: true,
            optionSuccessStatus: 200
        } 
    }else{
         temp={
            origin :"stupid"
         }   
    }
    res(null, temp)
}

 
 
dotenv.config();

mongoose.connect(process.env.MONGODB_URL).then(()=> {console.log("Connect to DB")}
).catch(err => console.log(err.message))

const app = express();
app.use(cors(options))
app.use(express.json());
app.use(express.urlencoded({extended: true}))
              
// app.use("/api/upload", uploadRouter);
app.use("/api/users", userRouter);


   
const port = process.env.PORT || 5000;

 
app.listen(port, () => {
  console.log(`Server is running at port ${port}`);
});  
       