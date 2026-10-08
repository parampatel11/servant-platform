import { Schema, model } from "mongoose";

const paymentSchema = new Schema({
    client:{
        type: Schema.Types.ObjectId,
        ref:"User",
        required: true
    },
    servant:{
        type: Schema.Types.ObjectId,
        ref:"User",
        default: null
    },
    razorpayOrderId:{
        type: String,
        required: true,
        trim: true
    },
    razorpayPaymentId:{
        type: String,
        trim: true,
        default: null
    },
    razorpaySignature:{
        type: String,
        trim: true,
        default: null
    },
    amount:{
        type: Number,
        required: true
    },
    currency:{
        type: String,
        default: "INR",
        trim: true
    },
    status:{
        type: String,
        enum: ["pending","completed","failed"],
        default: "pending"
    }
},{timestamps: true})

const PaymentModel = model("payment",paymentSchema)
export default PaymentModel