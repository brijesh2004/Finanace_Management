import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { User } from '../models/User.js';
dotenv.config();
const auth=async (req , res , next)=>{
   try{

    const token = req.cookies.financetoken;

    if (!token) {
      throw new Error("No token provided");
    }
    const verifyToken = jwt.verify(token, process.env.SECRET_KEY);
    const rootUser = await User.findById({ _id: verifyToken.id });

    if (!rootUser) {
      throw new Error("User not found");
    }

    req.token = token;
    req.rootUser = rootUser;
    req.userId = rootUser._id;

    next();
   }
   catch(err){
    res.status(401).send("Unauthorized : No token Provided")
   }
}

export default auth;