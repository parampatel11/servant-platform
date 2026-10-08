import { Response } from "express";
import { SessionInterface } from "../middlewares/auth.middleware";
import { TryError } from "../utils/error";

export const handleBookingResponse = async (req: SessionInterface, res: Response)=>{
    try{
        if(!req.session){
            throw TryError("Unauthorized to respond to booking",401)
        }

        const { bookingId } = req.params
        const {action} = req.body

        if(!bookingId || !action){
            throw TryError("Booking ID and action are required", 400)
        }
    }
    catch(err){

    }
}