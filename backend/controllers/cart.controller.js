

import product from "../models/product.module.js";

//get cart product
export const getCartProducts = async(req, res)=>{
    try {
        const products = await product.find({_id: {$in : req.user.cartItems}})
         // add quantity for each product
         const cartItems = products.map((product)=>{
            const item = req.user.cartItems.find((cartItems)=>cartItems.id === product.id)
            return{...product.toJSON(), quantity: item.quantity}
         });
         res.json(cartItems)
    } catch (error) {
        console.log("Error in  getCartProduct controller ", error.message);
        res.status(500).json({message:"serer error", error: error.message})
        
    }
}

// adding item to the cart
export const addToCart = async(req, res)=>{
    try {
        const {productId} = req.body;
        const user = req.body;

        const existingItem = user.cartItems.find(item=> item.id === productId)
        if(existingItem){
            existingItem.quantity += 1
        }else{
            user.cartItems.push(productId)
        }
        await user.save()
        res.json(user.cartItems)
        
    } catch (error) {
        console.log("Error in  addToCart controller ", error.message);
        res.status(500).json({message:"serer error", error: error.message})
        
        
    }
}


// removing item from the cart
export const removeAllFromCart = async(req, res)=>{
    try {
        const {productId} = req.body;
        const user = req.body;
        if(!productId){
            user.cartItems = []
        }else{
            user.cartItems = user.cartItems.filter((item)=> item.id !== productId)
        }
        await user.save()
        res.json(user.cartItems)
    } catch (error) {
        console.log("Error in  removeAllFromCart controller ", error.message);
        res.status(500).json({message:"serer error", error: error.message})
        
        
    }
}


export const updateQuantity = async(req,res)=>{
    try {
        const {id: productId} = req.params;
        const {quantity} = req.body;
        const user = req.body;
        const existingItem = user.cartItems.find((item)=>item.id === productId)

        if(existingItem){
            if(quantity ===0){
                user.cartItems = user.cartItems.filter((item)=> item.id !== productId)
                await user.save()
                return res.json(user.cartItems)

            }
            existingItem.quantity = quantity;
            await user.save()
            res.json(user.cartItems)
        }else{
            res.status(404).json({message: "product not found"})
        }
    } catch (error) {
        console.log("Error in  updateQuantity controller ", error.message);
        res.status(500).json({message:"serer error", error: error.message})
        
    }
}