import User from "../models/user.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const generateToken=(userId)=>{
    const payload={"id":userId}
    return jwt.sign(payload,process.env.JWT_SECRET)
}

export const registerUser=async(req,res)=>{
    try {
        const {name,email,password}=req.body
        if(!name||!email||!password||password.l<8) return res.json({success:false,message:'Fill all the fields!'})
        const userExists=await User.findOne({email})
        if(userExists) return res.json({success:false,message:'User Already Exists!'})
        const hashedpassword=await bcrypt.hash(password,10)
        const user=await User.create({email,name,password:hashedpassword})
        const token=generateToken(user._id)
        return res.json({success:true,token})
    } catch (error) {
        console.log(error.message)
        return res.json({success:false,message:error.message})
    }
}

export const loginUser=async(req,res)=>{
    try {
        const {email,password}=req.body
        const user=await User.findOne({email})
        if(!user) return res.json({success:false,message:"User Not Found!"})
        const isMatch=bcrypt.compare(password,user.password)
        if(!isMatch) return res.json({success:false,message:"Invalid Credentials!"})
        const token=generateToken(user._id)
        return res.json({success:true,token})
        
    } catch (error) {
        console.log(error.message)
        return res.json({success:false,message:error.message})
    }
}

export const getUserData=async(req,res)=>{
    try {
        const {user}=req
        return res.json({success:true,user})
    } catch (error) {
        console.log(error.message)
        return res.json({success:false,message:error.message})
    }
}