import { Router } from "express";
import { createOrder, verifyPayment } from "../controllers/payment.controller";
import AuthMiddleware from "../middlewares/auth.middleware";

const paymentRouter = Router()

paymentRouter.post("/create-order", AuthMiddleware, createOrder)
paymentRouter.post("/verify", AuthMiddleware, verifyPayment)

export default paymentRouter