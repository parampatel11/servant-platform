import dotenv from "dotenv"
dotenv.config()

import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import mongoose from "mongoose"
import authRouter from "./routes/auth.routes"
import clientRouter from "./routes/client.routes"

const PORT = process.env.PORT || 8000

const app = express()
app.listen(PORT,()=>{
    console.log(`Server is running on ${PORT}`)
})

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cors({
    origin:"http://localhost:3000",
    credentials: true
}))
app.use(cookieParser());

mongoose.connect(process.env.MONGO_URI!)
.then(()=>{
    console.log("Database connected successfully")
})
.catch(()=>{
    console.log("Database connection failed")
})

app.use("/api/auth",authRouter)
app.use("/api/client",clientRouter)

app.get("/",(req,res)=>{
    res.json({message:"Shiftserve API is running!"})
})