import mongoose, { mongo } from "mongoose";

const couponSchema = await mongoose.Schema(
    {
        code:{
            type: String,
            require:true,
            unique: true,
        },
        discountPercentage:{
            type: Number,
            required:true,
            min: 0,
            max: 100,
        },
        expirationDte:{
            type: Date,
            required: true,
        },
        
            isActive:{
                type: Boolean,
                default: true,
            },
            userId:{
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true,
                unique: true,
            },

    },
    {
        timestamps: true,
    }
    
)
 const coupon = mongoose.model("coupon", couponSchema)
 export default coupon