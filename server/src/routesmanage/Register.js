import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { Income, User } from '../models/User.js';
import nodemailer from 'nodemailer';
dotenv.config();
const secret = process.env.SECRET_KEY;


function generateRandomCode(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters[randomIndex];
    }
    return result;
}


const sendemail = async (email) => {
    try {
        // Generate a 6-digit verification code

        const verificationCode = generateRandomCode(6);
        const userFind = await User.findOne({ email });
        
        if (!userFind) {
            return false;
        }
        const name = userFind.name;
        const savedCode = await bcrypt.hash(verificationCode, 10);
        userFind.verifiedCode = savedCode;
        userFind.verified = false;

        await userFind.save();
        const mail = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });


        // Email options
        // Send the email
        mail.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Email verification',
            html: `Hi ${name} \n\n Your Code-> ${verificationCode}`
        }, (err) => {
            if (err) throw err;
            res.send('Mail has been send')
        })

        return true;
    }
    catch (err) {
        return false;
    }
}


export const register = async (req, res) => {
    try {
        let { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(403).json({ err: 'Please fill all the fields' });
        }

        const userFind = await User.findOne({ email });
        if (userFind) {
            return res.status(401).json({ err: 'User Already Present' });
        }
        password = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password });
        await newUser.save();
        const sendmail = await sendemail(email);
        if (!sendmail) {
            return res.status(400).json({ err: 'error while sending the email' });
        }
        return res.status(201).json({ mess: 'User Registered!', id: newUser._id });
    }
    catch (err) {
        return res.status(400).json({ err: err })
    }
}





// verifying the email
export const verifyEmail = async (req, res) => {
    try {
        const { email, code } = req.body;
        const findUser = await User.findOne({ email });
        if (!findUser) {
            return res.status(400).json({ err: 'somthing went wrong or User not registered' });
        }
        const verifiedCode = await bcrypt.compare(code, findUser.verifiedCode);

        if (!verifiedCode) {
            return res.status(401).json({ err: 'Code not matched' });
        }
        findUser.verified = true;
        await findUser.save();
        // JWT token 
        const token = jwt.sign({ id: findUser._id }, secret, { expiresIn: '1d' })

        // Set the cookie with the token
        await res.cookie('financetoken', token, { httpOnly: true, secure: true, sameSite: 'none' });

        return res.status(201).json({ mess: 'User verified' });
    }
    catch (err) {
        return res.status(401).json({ err: 'code must be same' });
    }
}







// login to the account

export const login = async (req, res) => {
    try {

        const { email, password } = req.body;

        const findUser = await User.findOne({ email });
        if (!findUser) {
            return res.status(400).json({ err: 'User credentials are wrong' });
        }
        const isverified = findUser.verified;

        if (!isverified) {
            return res.status(400).json({ err: 'You are Not verified Yet' });
        }

        const isPasswordMatched = await bcrypt.compare(password, findUser.password);

        if (!isPasswordMatched) {
            return res.status(400).json({ err: 'User Creadentials wrong' });
        }

        // JWT token 
        const token = jwt.sign({ id: findUser._id }, secret, { expiresIn: '3650d' })

        // Set the cookie with the token
        await res.cookie('financetoken', token, { httpOnly: true, secure: true, sameSite: 'none' });
        return res.status(200).json({ mess: "Logined!" })
    }
    catch (err) {
        return res.status(400).send(err);
    }
}


export const logout = async (req, res) => {
    try {
        await res.cookie('financetoken', '', {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            expires: new Date(0) // Sets the cookie to expire immediately
        });

        return res.status(200).json({ message: 'Logout successful' });
    }
    catch (err) {
        return res.status(400).send(err);
    }
}





export const finance = async (req, res) => {
    try {
        let { inEx, type, amount, exAddress } = req.body;
        const userId = await req.rootUser._id;
        amount = Number(amount);
        if (!amount || amount <= 0) {
            return res.status(400).json({ err: "Invalid amount" });
        }
        let findIncome = await Income.findOne({ userId: userId });
        if (!findIncome) {
            if (inEx === "income") {
                findIncome = new Income({
                    userId: userId,
                    totalIncome: amount,
                    addOrExpIncome: [{
                        incomeorexpanse: inEx,
                        types: type,
                        amount: amount
                    }]
                });
                await findIncome.save();
                return res.status(201).json({ mess: "User Created" });
            }
            else {
                return res.status(401).json({ err: "Not Created" });
            }
        }


        if (exAddress) {
            const detail = findIncome.addOrExpIncome;
            const entry = detail.find(entry => entry._id.equals(exAddress));

            if (entry) {
                // Update the existing entry with new values
                entry.incomeorexpanse = inEx;
                entry.types = type;
        
                if (inEx === "income") {
                  findIncome.totalIncome += amount - entry.amount;
                } else {
                  if (findIncome.totalIncome < amount) {
                    return res.status(403).json({ err: "You are going less than zero" });
                  }
                  findIncome.totalIncome -= amount - entry.amount;
                }
                entry.amount = amount;
                await findIncome.save();
                return res.status(201).json({ mess: "Updated successfully" });
              } else {
                return res.status(404).json({ err: "Entry not found" });
              }

        }


        if (inEx === "income") {
            findIncome.totalIncome += amount;
            findIncome.addOrExpIncome.unshift({
                incomeorexpanse: 'income',
                types: type,
                amount: amount
            });
        } else {
            if (findIncome.totalIncome < amount) {
                return res.status(403).json({ err: "You are going less than zero" });
            }
            findIncome.totalIncome -= amount;
            findIncome.addOrExpIncome.unshift({
                incomeorexpanse: 'expanse',
                types: type,
                amount: amount
            });
        }
        await findIncome.save();
        return res.status(201).json({ mess: "Added successfully" });
    }
    catch (err) {
        return res.status(400).json({ err: 'Error while adding income and expanse' });
    }
}


export const deleteBills = async(req , res)=>{
    try{
        const userId = req.rootUser._id;
        const { exId } = req.body;
    
        // Find the user's income document
        let findIncome = await Income.findOne({ userId: userId });
        if (!findIncome) {
          return res.status(400).json({ err: "Data Not Found" });
        }
    
        // Find the entry in the addOrExpIncome array
        const detail = findIncome.addOrExpIncome;
        const entryIndex = detail.findIndex(entry => entry._id.equals(exId));
        if (entryIndex === -1) {
          return res.status(400).json({ err: "Data Not Found" });
        }
    
        // Get the entry to adjust totalIncome
        const entry = detail[entryIndex];
        
        // Adjust totalIncome based on the type of entry
        if (entry.incomeorexpanse === "income") {
          findIncome.totalIncome -= entry.amount;
        } else {
          findIncome.totalIncome += entry.amount;
        }
    
        // Remove the entry from the array
        detail.splice(entryIndex, 1);
    
        // Save the updated income document
        await findIncome.save();
        return res.status(200).json({mess:"Deleted"});
    }
    catch(err){
        return res.status(400).json({ err: "Error Deleting the Data" });
    }
}


export const forgot = async(req , res)=>{
    try{
     const {email} = req.body;
     const send = sendemail(email);
     if(send){
        return res.status(200).json({mess:"Email Send"});
     }
     else
     {
        throw Error;
     }
    }
    catch(err){
     return res.status(400).json({mess:"Error while sending the email"});
    }
}



export const setNewPassword = async (req , res)=>{
    try{
    let {email , password , code} = req.body;
    const userFind = await User.findOne({email});
    if(!userFind){
        return res.status(400).json({err:"User Not Found"});
    }
    const compareCode = await bcrypt.compare(code , userFind.verifiedCode);
    if(!compareCode){
        return res.status(402).json({err:"Code Not Matched"});
    }
    password = await bcrypt.hash(password , 10);
    userFind.password = password;
    userFind.verified=true;
    await userFind.save();
    return res.status(200).json({mess:"Password Updated"});
    }
    catch(err){
     return res.status(400).json({err:"Error on Updating the password"});
    }
}






export const profile = async (req, res) => {
    try {
        const userId = await req.rootUser._id;
        if (!userId) {
            return res.status(401).json({ err: "Unauthorized user" });
        }
        const user = await User.findById(userId).select("name");

        const FindData = await Income.findOne({ userId: userId });
        return res.status(200).json({ details: FindData.addOrExpIncome, total: FindData.totalIncome, name: user });
    }
    catch (err) {
        return res.status(400).json({ err: "Error while finding the data" });
    }
}