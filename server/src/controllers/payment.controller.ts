import { Response } from "express";
import Razorpay from "razorpay";
import crypto from "crypto"
import { SessionInterface } from "../middlewares/auth.middleware";
import { CatchError, TryError } from "../utils/error";
import PaymentModel from "../models/payment.model";

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!
})

export const createOrder = async (req: SessionInterface, res: Response) => {
    try {
        if (!req.session) {
            throw TryError("Unauthorized to create payment", 401)
        }

        const { amount, servantId } = req.body

        if (!amount) {
            throw TryError("Amount is required", 400)
        }

        const options = {
            amount: amount * 100,
            currency: 'INR',
            receipt: `receipt_${Date.now()}`
        }

        const order = await razorpay.orders.create(options)

        await PaymentModel.create({
            client: req.session.id,
            servant: servantId || null,
            razorpayOrderId: order.id,
            amount: amount,
            currency: "INR",
            status: "pending"
        })

        res.status(200).json({ message: "Order created successfully", order })
    }
    catch (err) {
        CatchError(err, res, "Failed to create payment order")
    }
}

export const verifyPayment = async (req: SessionInterface, res: Response) => {
    try {
        if (!req.session) {
            throw TryError("Unauthorized to verify payment", 401)
        }

        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            throw TryError("Missing payment verification details", 400)
        }

        const body = razorpay_order_id + "|" + razorpay_payment_id
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
            .update(body.toString())
            .digest('hex')

        const isAuthentic = expectedSignature === razorpay_signature

        if (!isAuthentic) {
            await PaymentModel.findOneAndUpdate(
                { razorpayOrderId: razorpay_order_id },
                {
                    $set: {
                        status: "failed"
                    }
                }
            )
            throw TryError("Payment verification failed. Invalid signature", 400)
        }

        const updatedPayment = await PaymentModel.findOneAndUpdate(
            { razorpayOrderId: razorpay_order_id },
            {
                $set: {
                    razorpayPaymentId: razorpay_payment_id,
                    razorpaySignature: razorpay_signature,
                    status: "completed"
                }
            },
            { new: true }
        )

        res.status(200).json({
            message: "Payment verified successfully",
            payment: updatedPayment
        })
    }
    catch (err: unknown) {
        CatchError(err, res, "Failed to verify payment")
    }
}