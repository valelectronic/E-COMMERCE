import express from "express"
import dotenv from "dotenv"
import cookieParser from 'cookie-parser'

// importing the user routes 
import authRoutes from "./routes/auth.route.js"
import productRoutes from "./routes/product.route.js"
import { connectDB } from "./lib/db.js"

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

app.listen(PORT, ()=>{
    console.log(`server is running on port ${PORT}`)
    connectDB()
})

// https://github.com/burakorkmez/mern-ecommerce/blob/master/backend/server.js