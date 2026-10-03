import dotenv from "dotenv"
dotenv.config()

import express from "express"
import cors from "cors"

const PORT = process.env.PORT || 8080

const app = express()
app.listen(PORT,()=>{
    console.log(`Server is running on ${PORT}`)
})

app.use(express.json())
app.use(cors())


app.get("/",(req,res)=>{
    res.json({message:"Shiftserve API is running!"})
})