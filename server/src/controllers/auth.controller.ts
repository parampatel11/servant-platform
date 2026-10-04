import { Request, Response } from "express";
import AuthModel from "../models/auth.model";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { CatchError, TryError } from "../utils/error";
import { PayloadInterface, SessionInterface } from "../middlewares/auth.middleware";
import { v4 as uuid } from "uuid"
import moment from "moment"
import { v2 as cloudinary } from "cloudinary"
import streamifier from "streamifier"

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

const accessTokenExpiry = '7d'
const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000

type TokenType = "at" | "rt"

const generateToken = (payload: PayloadInterface) => {
    const accessToken = jwt.sign(payload, process.env.AUTH_SECRET!, { expiresIn: accessTokenExpiry })
    const refreshToken = uuid()
    return {
        accessToken,
        refreshToken
    }
}

const getOptions = (tokenType: TokenType) => {
    return {
        httpOnly: true,
        maxAge: sevenDaysInMs,
        secure: process.env.NODE_ENV === "dev" ? false : true,
        domain: "localhost"
    }
}

const uploadToCloudinary = (buffer: Buffer): Promise<string> => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            { folder: "shiftserve_profiles" }, (error, result) => {
                if (result) {
                    resolve(result.secure_url)
                }
                else {
                    reject(error)
                }
            }
        )
        streamifier.createReadStream(buffer).pipe(uploadStream)
    })
}

export const signup = async (req: Request, res: Response)=>{
    try{
        if (req.body.role === "admin"){
            throw TryError("Unauthorized role section", 403)
        }

        let imageUrl = null
        if(req.file){
            imageUrl = await uploadToCloudinary(req.file.buffer)
        }

        await AuthModel.create({...req.body,image: imageUrl})

        res.json({message:"Signup success"})
    }
    catch(err: unknown){
        CatchError(err,res,"Signup failed")
    }
}

export const login = async (req: Request, res: Response)=>{
    try{
        const {email,password} = req.body
        const user = await AuthModel.findOne({email})

        if(!user){
            throw TryError("Invalid credentials, email or password incorrect", 401)
        }

        const isLogin = await bcrypt.compare(password, user.password);
        if (!isLogin) {
            throw TryError("Invalid credentials, email or password incorrect", 401);
        }

        const payload: PayloadInterface = {
            id: user._id,
            fullname: user.fullname,
            email: user.email,
            mobile: user.mobile,
            role: user.role,
            image: user.image ?? null,
        }

        const {accessToken, refreshToken} = generateToken(payload)

        await AuthModel.updateOne(
            {_id: user._id},
            {
                $set:{
                    refreshToken,
                    expiry: moment().add(7, "days").toDate()
                }
            }
        )

        res.cookie("accessToken", accessToken, getOptions("at"))
        res.cookie("refreshToken", refreshToken, getOptions("rt"))
        res.json({message: "Login success", role: user.role})
    }
    catch(err:unknown){
        CatchError(err, res, "Login failed please try after sometime")
    }
}

export const refreshToken = async (req: SessionInterface, res: Response)=>{
    try{
        if(!req.session){
            throw TryError("Failed to refresh token")
        }
        const { accessToken, refreshToken} = generateToken(req.session)

        await AuthModel.updateOne(
            {_id: req.session.id},
            {
                $set:{
                    refreshToken,
                    expiry: moment().add(7, "days").toDate()
                }
            }
        )

        res.cookie("accessToken", accessToken, getOptions("at"))
        res.cookie("refreshToken", refreshToken, getOptions("rt"))
        res.json({message: "Token refreshed"})
    }
    catch(err){
        CatchError(err, res, "Failed to refresh token")
    }
}

export const getSession = async (req: Request, res: Response)=>{
    try{
        const accessToken = req.cookies.accessToken
        if(!accessToken){
            throw TryError("Invalid session", 401)
        }

        const session = jwt.verify(accessToken, process.env.AUTH_SECRET!)
        res.json(session)
    }
    catch(err){
        CatchError(err,res,"Invalid session")
    }
}

export const updateProfilePicture = async (req: SessionInterface, res: Response)=>{
    try{
        if(!req.session){
            throw TryError("Failed to update profile picture",401)
        }
        if(!req.file){
            throw TryError("No image file provided",400)
        }

        const imageUrl = await uploadToCloudinary(req.file.buffer)

        await AuthModel.updateOne(
            { _id: req.session.id},
            { $set: {image: imageUrl}}
        )
        res.json({message: "Profile picture updated", image: imageUrl})
    }
    catch(err){
        CatchError(err, res, "Failed to update profile picture")
    }
}

export const logout = async (req: Request, res: Response)=>{
    try{
        const options = {
            httpOnly : true,
            maxAge : 0,
            secure : process.env.NODE_ENV === "dev" ? false : true,
            domain : "localhost"
        }

        res.clearCookie("accessToken",options)
        res.clearCookie("refreshToken",options)
        res.json({message: "Logout success"})
    }
    catch(err){
        CatchError(err, res, "Logout failed")
    }
}

export const gotMe = async ( req: SessionInterface, res: Response)=>{
    try{
        if(!req.session){
            return res.status(401).json({message:"Unauthorized"})
        }

        res.status(200).json({user: req.session})
    }
    catch(err){
        CatchError(err, res, "Internal server error")
    }
}