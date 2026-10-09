import { Response } from "express";
import { SessionInterface } from "../middlewares/auth.middleware";
import { CatchError, TryError } from "../utils/error";
import BookingModel from "../models/booking.model";
import AuthModel from "../models/auth.model";

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

        const booking = await BookingModel.findById(bookingId)

        if(!booking){
            throw TryError("Booking not found", 404)
        }

        if(booking.servant.toString() !== req.session.id.toString()){
            throw TryError("Not authorized to respond to this booking",403)
        }

        if(action === "rejected"){
            booking.status = "rejected"
            await booking.save()

            return res.status(200).json({ message: "Booking rejected, client refund: initiated"})
        }

        if(action === "accept"){
            booking.status = "on_the_way"
            booking.travelStartTime = new Date()
            await booking.save()

            await AuthModel.findByIdAndDelete(booking.servant,{$set:{isAvailable: false}})

            return res.status(200).json({
                message: "Booking accepted. 10-minutes travel timer started.",
                travelStartTime: booking.travelStartTime
            })
        }

        throw TryError("Invalid action type", 400)
    }
    catch(err){
        CatchError(err,res,"Failed to handle booking response")
    }
}

export const getPendingBookings = async (req: SessionInterface, res: Response)=>{
    try{
        if(!req.session){
            throw TryError("Unauthorized",401)
        }

        const pendingBookings = await BookingModel.find({
            servant: req.session.id,
            status: "pending"
        }).populate("client", "name email")

        res.status(200).json({bookings:pendingBookings})
    }
    catch(err: unknown){
        CatchError(err, res, "Failed to fetch pending bookings")
    }  
}

export const startWork = async (req: SessionInterface, res: Response)=>{
    try{
        if(req.session){
            throw TryError("Unauthorized", 401)
        }
        const {bookingId} = req.params
        const booking = await BookingModel.findById(bookingId)

        if(!booking){
            throw TryError("Booking not found",404)
        }
        if(booking.status !== "on_the_way"){
            throw TryError("Invalid booking state",400)
        }

        booking.status = "in_progress",
        booking.workStartTime = new Date()
        await booking.save()

        res.status(200).json({message:"Work started successfully", booking})
    }
    catch(err: unknown){
        CatchError(err, res , "Failed to start work")
    }
}

export const completeWork = async (req: SessionInterface, res: Response)=>{
    try{
        if(!req.session){
            TryError("Unauthorized",401)
        }

        const {bookingId} = req.params
        const booking = await BookingModel.findById(bookingId)

        if(!booking){
            throw TryError("Booking not found", 401)
        }

        if(booking.status !== "in_progress"){
            throw TryError("Invalid booking state", 400)
        }

        booking.status = "complete"
        await booking.save()

        await AuthModel.findByIdAndUpdate(booking.servant,{
            $set: {
                isAvailable: true
            }
        })

        res.status(200).json({message:"Shift completed. You are now available for new bookings."})
    }
    catch(err: unknown){
        CatchError(err, res, "Failed to complete work")
    }
}