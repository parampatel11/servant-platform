import { Schema, model} from "mongoose"

const bookingSchema = new Schema({
    client:{
        type: Schema.Types.ObjectId,
        ref:"User",
        required: true
    },
    servant:{
        type: Schema.Types.ObjectId,
        ref:"User",
        required: true
    },
    payment:{
        type: Schema.Types.ObjectId,
        ref:"payment",
        required: true
    },
    durationHours:{
        type: Number,
        required: true,
        enum:[1,2,3]
    },
    status:{
        type: String,
        enum: ["pending","on_the_way","in_progress","complete","rejected"],
        default:"pending"
    },
    travelStartTime:{
        type: Date,
        default: null
    },
    workStartTime:{
        type: Date,
        default: null
    }
},{timestamps:true})

const BookingModel = model("booking",bookingSchema)
export default BookingModel