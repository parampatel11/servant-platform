import { Router } from "express";
import AuthMiddleware from "../middlewares/auth.middleware";
import { handleBookingResponse } from "../controllers/booking.controller";

const bookingRouter = Router()

bookingRouter.post("/respond/:bookingId", AuthMiddleware, handleBookingResponse)

export default bookingRouter