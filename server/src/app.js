import express from "express";
import dotenv from 'dotenv';
import './db/conn.js';
import cors from 'cors';
import auth from './middleware/auth.js';
import cookieParser from 'cookie-parser'
import { login, register, verifyEmail  , logout, finance , profile, deleteBills, forgot, setNewPassword} from "./routesmanage/Register.js";


dotenv.config();

const app = express();
const PORT = process.env.PORT|| 5000;
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
    origin:process.env.FRONTEND,
    methods:['GET' , 'POST' , 'DELETE','UPDATE'],
    credentials:true // allows cookies
}))
app.get("/",(req , res)=>{
    res.send("Hello ");
})

app.post("/register" , register);
app.post("/verifyemail" , verifyEmail);
app.post('/login' , login);

app.get("/about" , auth , (req , res)=>{
    res.status(200).send(req.rootUser);
})
app.post("/logout" ,logout);
app.post("/finance" , auth , finance);
app.get("/profile" , auth , profile);
app.post("/delete" , auth , deleteBills);
app.post("/forgot" , forgot)
app.post("/changepassword" , setNewPassword);


app.listen(PORT , ()=>{
    console.log(`App Listening on port ${PORT}`);
})