import mongoose  from "mongoose";

export const connectDB = async()=>{
    try {
        const connected = await mongoose.connect(process.env.DB_url)
        console.log(`mongodDB connected: ${connected.connection.host}`)
    
    } catch (error) {
        console.log("error connecting to mongoDB", error.message)
        process.exit(1)
    }
}