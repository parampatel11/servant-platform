import multer from "multer"
import { TryError } from "../utils/error"

const storage = multer.memoryStorage();

const fileFilter = (req:any, file: Express.Multer.File, cb: multer.FileFilterCallback)=>{
    if(file.mimetype.startsWith("image/")){
        cb(null,true)
    }
    else{
        cb(TryError("Only image files are allowed", 400) as any, false)
    }
}

export const uploadMiddleware = multer({
    storage,
    limits:{
        fileSize: 500 * 1024, // 500 KB in bytes
    },
    fileFilter
})