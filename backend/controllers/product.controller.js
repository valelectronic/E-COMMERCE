import product from "../models/product.module.js"

 
 export const getAllProducts = async(req, res)=>{

    try {
        const products = await product.find({}) //find all products
        res.json({products})
    } catch (error) {
        console.log("Error getting all products", error.message);
        res.status(500).json({message:"serer error", error: error.message})
    }
}