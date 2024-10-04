import Jwt from "jsonwebtoken";
import User from "../models/user.model.js";

// next checks if a function exists , then proceed into calling another function
export const protectRoute = async(req, res,next)=>{
    try {
        const accessToken = req.cookies.accessToken;
        if(!accessToken){
            return res.status(401).json({message:"unauthorized - no access token provided"})

        }
       try {
        const decoded = Jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decoded.userId).select("-password")
        if(!user){
            return res.status(401).json({message: "user not found"})
        }
        req.user = user
        next()
        
       } catch (error) {
        if(error.name === "TokenExpiredError"){
            return res.status(401).json({message:"user not found"})
        }
       }
    } catch (error) {
        console.log("Error in protectRoute middleware", error.message)
        return res.status(401).json({message: "unauthorized -invalid access token"})
        
    }


}

export const adminRoute = (req,res, next) =>{
    if(req.user && req.user.role === "admin"){
        next()
    }else{
        return res.status(403).json({message: "Access denied - Admin only"})
    }
}