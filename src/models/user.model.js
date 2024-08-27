import mongoose, { Schema } from "mongoose";

const userSchema  = new Schema({
    name: {
        type: String,
        required: [true , 'Name is required'],
        trim: true
    },
    email: {
        type: String,
        required:[true , 'Email is required'] ,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required:[true , 'Password is required']
    },
    address: {
        type: [String],
    },
    phone:{
        type:[String],
    },
    confirmed:{
        type:Boolean,
        default:false
    },
    loggedIn:{
        type:Boolean,
        default:false
    },
    role:{
        type:String,
        enum:['user' , 'admin'],
        default:'user'
    },
    code:String,
    passwordChangeAt:Date

} , {timestamps: true , versionKey: false})

export const userModel = mongoose.model('user', userSchema)