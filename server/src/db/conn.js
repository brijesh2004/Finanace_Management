import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
const url = process.env.DB_URL;

mongoose.connect(url,{
})
.then(()=>{
    console.log('DB connected');
})
.catch((err)=>{
    console.log("error");
})
