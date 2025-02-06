import coupon from "../models/coupon.model.js";


// getting the coupon code
export const getCoupon = async(req,res)=>{
    try {
        const coupons = await coupon.findOne({userId: req.user._id, isActive: true})
        res.json(coupons || null);

    } catch (error) {
        console.log("Error in  getCoupon controller ", error.message);
        res.status(500).json({message:"serer error", error: error.message})
        
        
    }
}


// validate coupon 
export const validateCoupon = async(req, res)=>{
    try {
        const { code } = req.body;
        const coupons = await coupon.findOne({code: code, userId: req.user._id, isActive: true})
        if(!coupons){
            return res.status(400).json({message: "coupon not found"})
        }
        if(coupons.expirationDate < new Date()){
            coupons.isActive = false;
            await coupons.save();
            return res.status(400).json({message:"coupon expired"})
        }
        res.json({
            message: "coupon is valid",
            code:coupons.code,
            discountPercentage:coupons.discountPercentage
        })
    } catch (error) {
        console.log("Error in  validateCoupon controller ", error.message);
        res.status(500).json({message:"serer error", error: error.message})
        
    }
}