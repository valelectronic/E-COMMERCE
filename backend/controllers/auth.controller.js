import { redis } from "../lib/redis.js"
import User from "../models/user.model.js"

import jwt from "jsonwebtoken"

const generateToken = (userId)=>{
const accessToken = jwt.sign({userId}, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m"
})

const refreshToken = jwt.sign({userId}, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d"
})
 return{accessToken,refreshToken}
}

const storeRefreshToken = async (userId, refreshToken) =>{
    return redis.set(`refresh_token:${userId}`, refreshToken, "EX",7 * 24 *60 * 60 * 1000); //7 days

}

const setCookies = (res, accessToken, refreshToken)=>{
    res.cookie("accessToken", accessToken,{
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge : 15 * 60 * 1000


    })
    res.cookie("refreshToken", refreshToken,{
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge : 7 * 24 *60 * 60 * 1000


    })
}


// signup functionality

export const signup = async (req, res)=>{
    const  { email, password , name } = req.body

try {
    
const userExists = await User.findOne({email})

if(userExists){
    return res.status(400).json({message:"user already exists"})
}
const user = await User.create({name, email, password})

// authenticate user 
const {accessToken, refreshToken}  = generateToken(user._id)
await storeRefreshToken(user._id, refreshToken)

setCookies(res,accessToken,refreshToken)

res.status(201).json({
    _id:user._id,
    name,
    email,
    role:user.role,
})
} catch (error) {
    console.log("Error in sign up controller", error.message)
    res.status(500).json({message: error.message})
    
}
   
}

// login functionality
export const login = async (req, res) => {
	try {
		const { email, password } = req.body;
		const user = await User.findOne({ email });

        if (!user) {
    return res.status(400).json({ message: 'User not found' });
}
	if (user && (await user.comparePassword(password))) {
			const { accessToken, refreshToken } = generateToken(user._id);
            console.log("logged in ")
			await storeRefreshToken(user._id, refreshToken);
			setCookies(res, accessToken, refreshToken);

			res.json({
				_id: user._id,
				name: user.name,
				email: user.email,
				role: user.role,
			});
		} else {
			res.status(400).json({ message: "Invalid email or password" });
		}
	} catch (error) {
		console.log("Error in login controller", error.message);
		res.status(500).json({ message: error.message });
	}
};


// logout functionality 
export const logout = async (req, res) => {
	try {
		const refreshToken = req.cookies.refreshToken;
		if (refreshToken) {
			const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
			await redis.del(`refresh_token:${decoded.userId}`);
		}

		res.clearCookie("accessToken");
		res.clearCookie("refreshToken");
		res.json({ message: "Logged out successfully" });
	} catch (error) {
		console.log("Error in logout controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};


// recreating an access token 
export const refreshToken = async (req, res)=>{
    try {
        const refreshToken = req.cookies.refreshToken;
        if(!refreshToken){
            return res.status(401).json({message:"no refresh token provided"})
        }
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
        const storedToken = await redis.get(`refresh_token:${decoded.userId}`)
        if(storedToken !== refreshToken){
            return res.status(401).json({message:"invalid refresh token "})
        }
        const accessToken = jwt.sign({userId: decoded.userId}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: "15m"})
        res.cookie("accessToken", accessToken,{
            httpOnly:true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 15 * 60 * 1000,
        })
        res.json({message: "token refreshed successfully "})
        
    } catch (error) {
        console.log("Error in refreshToken controller", error.message)
        res.status(500).json({message:"server error", error: error.message})
    }
}

// profile page functionality

export const getProfile = async(req, res) =>{
    try {
        
    } catch (error) {
        
    }
}