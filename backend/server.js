import express from "express"
import dotenv from "dotenv"
import cookieParser from 'cookie-parser'

// importing the user routes 
import authRoutes from "./routes/auth.route.js"
import productRoutes from "./routes/product.route.js"
import { connectDB } from "./lib/db.js"
import cartRoutes from "./routes/cart.route.js"
import couponRoutes from "./routes/coupon.route.js"
import paymentRoutes from "./routes/payment.route.js"
import analyticsRoutes from "./routes/payment.route.js"

dotenv.config()
// initializing the express app
const app = express()

const PORT  = process.env.port || 3000

// in order to use the req.body in the auth controller
app.use(express.json())
app.use(cookieParser());
// navigation routes
app.use("/api/auth", authRoutes)
app.use("/api/products", productRoutes)
app.use("/api/cart",cartRoutes)
app.use("/api/coupons",couponRoutes)
app.use("/api/payments",paymentRoutes)
app.use("/api/analytics",analyticsRoutes)

app.listen(PORT, ()=>{
    console.log(`server is running on port ${PORT}`)
    connectDB()
})

// https://github.com/burakorkmez/mern-ecommerce/blob/master/backend/server.js