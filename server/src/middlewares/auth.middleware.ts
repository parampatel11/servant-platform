import { NextFunction, Request, Response } from "express";
import { CatchError, TryError } from "../utils/error";
import jwt,{JwtPayload} from "jsonwebtoken"
import mongoose from "mongoose";

export interface PayloadInterface{
    id: mongoose.Types.ObjectId,
    fullname: string,
    email: string,
    mobile: string,
    role: string,
    image: string | null
}

export interface SessionInterface extends Request {
    session? : PayloadInterface
}

const AuthMiddleware = async (req: SessionInterface, res: Response, next: NextFunction)=>{
    try{
        const accessToken = req.cookies.accessToken

        if(!accessToken){
            throw TryError("Failed to authorize user",401)
        }

        const payload = (await jwt.verify(accessToken,process.env.AUTH_SECRET!)) as JwtPayload

        req.session = {
            id: payload.id,
            email: payload.email,
            mobile: payload.mobile,
            fullname: payload.fullname,
            role: payload.role,
            image: payload.image ?? null
        }

        next();
    }
    catch(err){
        CatchError(err,res,"Failed to authorize user")
    }
}

export default AuthMiddleware