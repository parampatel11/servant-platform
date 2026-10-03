import { Response } from "express"

interface AppCustomError extends Error{
    statusCode?: number
}

export const TryError = (message: string, statusCode: number = 400): AppCustomError =>{
    const error : AppCustomError = new Error(message)
    error.statusCode = statusCode
    return error
}

export const CatchError = (err: unknown, res: Response, defaultMessage: string)=>{
    if(err instanceof Error){
        const statusCode = (err as any).statusCode || 500
        return res.status(statusCode).json({message: err.message})
    }

    return res.status(500).json({message: defaultMessage})
}