import mongoose from "mongoose";
import { type } from "os";

const UserSchema = mongoose.Schema({
    name:{
        type:String,
        required:[true , 'please provide the name']
    },
    email:{
        type:String,
        required:[true , 'please provide the email'],
        unique:true
    },
    password:{
        type:String,
        required:[true , 'please provide the password']
    },
    verified:{
        type:Boolean,
        default:false
    },
    verifiedCode:{
        type:String,
    }
})

const User = mongoose.model('User' , UserSchema);

const IncomeSchema = mongoose.Schema({
    userId:{
        type:String,
        required:[true , 'please provide user id']
    },
    totalIncome:{
        type:Number,
        default:0
    },
    addOrExpIncome:[{
       incomeorexpanse:{
        type:String,
       },
       date:{
        type:Date,
        default:Date.now
       },
       types:{
        type:String
       },
       amount:{
        type:Number
       }
    }]
})


const Income = mongoose.model('Income' , IncomeSchema);


export {User , Income};