import jwt from "jsonwebtoken"
import User from "../models/user.js"

export const protect=async(req,res,next)=>{
    const token=req.headers.authorization
    if(!token){
        return res.json({success:false,message:"Not authorized"})
    }
    try {
        const userId=jwt.verify(token,process.env.JWT_SECRET)
        if(!userId) return res.json({success:false,message:"Not authorized"})
        req.user=await User.findById(userId.id).select("-password")
        if(!req.user) {
            return res.status(401).json({success:false,message:"User not found"})
        }
        next()
    } catch (error) {
        console.log(error.message)
        return res.json({success:false,message:error.message})
    }
}
