

import cloudinary from "../lib/cloudinary.js";
import { redis } from "../lib/redis.js";
import product from "../models/product.module.js";


 //getting all products functionality
 export const getAllProducts = async(req, res)=>{

    try {
        const products = await product.find({}) //find all products
        res.json({products})
    } catch (error) {
        console.log("Error getting all products", error.message);
        res.status(500).json({message:"serer error", error: error.message})
    }

}


//getting all featured products functionality
export const getFeaturedProducts = async (req, res)=>{
    try {
        let FeaturedProducts = await redis("featured_product")
        if(FeaturedProducts){
            return res.json(JSON.parse(FeaturedProducts))
        }
        
        // if not on redis, fetch from mongodb
        //.lean() is going to return a plain javascript object instead of a mongodb documents
        // which is good for performance 
        FeaturedProducts  = await product.find({isFeatured: true}).lean()
        if(!FeaturedProducts){
            return res.status(404).json({message: "No featured products found "})

        }
        // store in redis for future quick  access 
        await redis.set("featured_products", JSON.stringify(FeaturedProducts))
        res.json(FeaturedProducts)
    } catch (error) {
        console.log("Error in getFeaturedProducts", error.message);
        res.status(500).json({message:"serer error", error: error.message})
        
    }
}

// create products 
export const createProduct = async (req, res)=>{
    try {
        
        const {name, description, price, image, category} = req.body
        let cloudinaryResponds = null;
        if(image){
            cloudinaryResponds = await cloudinary.uploader.upload(image, {folder: "products"})
        }

        const product = await product.create({
            name,
            description,
            price,
            image: cloudinaryResponds?.secure_url? cloudinaryResponds.secure_url:"",
            category
        })
        res.status(201).json(product)
    } catch (error) {
        console.log("Error in createProduct controller ", error.message);
        res.status(500).json({message:"serer error", error: error.message})
        
    }

}


export const deleteProduct = async (req, res) =>{
    try {
        const product = await product.findById(req.params.id)
        if(!product){
            return res.status(404).json({message: "product not found"})
        }
        if(product.image){
            const publicId = product.image.split("/").pop().split(".")[0]
            try {
                await cloudinary.uploader.destroy(`products/${publicId}`)
                console.log("deleted image from cloudinary ")
            } catch (error) {
                console.log("error deleting image from cloudinary", error)                
                
            }
        }
        // deleting from mongodb
        await product.findByIdAndDelete(req.params.id)
        res.json({message: "product deleted successfully "})
    } catch (error) {
        
        console.log("Error in deleteProduct controller ", error.message);
        res.status(500).json({message:"serer error", error: error.message})
        
    }
}
//stopped at 1:52
