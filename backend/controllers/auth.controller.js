import User from "../models/user.model.js"
export const signup = async (req, res)=>{
    const  { email, password , name } = req.body

try {
    
const userExists = await User.findOne({email})

if(userExists){
    return res.status(400).json({message:"user already exists"})
}
const user = await User.create({name, email, password})
res.status(201).json({user, message: "user was created"})
} catch (error) {
    res.status(500).json({message: error.message})
    
}
   
}


export const login = async (req, res)=>{
    res.send("logging in successfully ")
}



export const logout = async (req, res)=>{
    res.send("logging out in successfully ")
}