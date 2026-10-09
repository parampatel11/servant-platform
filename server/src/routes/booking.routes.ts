import { Router } from "express";
import AuthMiddleware from "../middlewares/auth.middleware";
import { completeWork, getPendingBookings, handleBookingResponse, startWork } from "../controllers/booking.controller";

const bookingRouter = Router()

bookingRouter.get("/pending", AuthMiddleware, getPendingBookings)
bookingRouter.post("/respond/:bookingId", AuthMiddleware, handleBookingResponse)
bookingRouter.post("/:bookingId/start-work", AuthMiddleware, startWork)
bookingRouter.post("/:bookingId/start-work", AuthMiddleware, startWork)
bookingRouter.post("/:bookingId/complete-work", AuthMiddleware, completeWork)

export default bookingRouter