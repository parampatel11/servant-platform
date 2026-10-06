import { Schema, model} from "mongoose"
import bcrypt from "bcryptjs"

const authSchema = new Schema({
    image:{
        type: String,
        default: null
    },
    fullname:{
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    email:{
        type: String,
        required: true,
        trim: true,
        unique: true,
        match: [/^[a-zA-Z0-9._%+-]+@gmail.com$/, "Only Gmail allowed"]
    },
    mobile:{
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password:{
        type: String,
        required: true,
        trim: true
    },
    role:{
        type: String,
        enum: ["client","servant","admin"],
        required: true
    },
    isOnBoarded:{
        type: Boolean,
        default: false
    },
    mainRoad:{
        type: String,
        trim: true
    },
    subRoad:{
        type: String,
        trim: true
    },
    skills:{
        type: [String],
        default: []
    },
    maxHours:{
        type: Number,
        enum: [1, 2, 3]
    },
    pricingTier:{
        oneHour:{type: Number},
        twoHours:{type: Number},
        threeHours:{type: Number}
    },
    address:{
        type: String,
        trim: true
    },
    refreshToken:{
        type: String,
        default: null
    },
    expiry:{
        type: Date,
        default: null
    }
},{timestamps:true})

authSchema.pre("save",async function (next){
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password.toString(),12)
    }
    next()
})

const AuthModel = model("User",authSchema)
export default AuthModel