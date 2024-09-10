import express from "express"
import dotenv from "dotenv"

// importing the user routes 
import authRoutes from "./routes/auth.route.js"
import { connectDB } from "./lib/db.js"

dotenv.config()
// initializing the express app
const app = express()

const PORT  = process.env.port || 3000

// authentication 

app.use("/api/auth", authRoutes)


app.listen(PORT, ()=>{
    console.log(`server is running on ${PORT}`)
    connectDB()
})

// https://github.com/burakorkmez/mern-ecommerce/blob/master/backend/server.js