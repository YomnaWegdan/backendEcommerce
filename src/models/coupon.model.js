import mongoose, { Schema } from "mongoose";

const couponSchema  = new Schema({
    code: {
        type: String,
        required: [true , 'code is required'],
        trim: true,
        unique: true
    },
    amount: {
        type: Number,
        required: [true , 'Amount is required'],
        min:1
    },
     createdBy:{
    type: Schema.Types.ObjectId,
    ref: 'user',
   },
   usedBy:{
    type: Schema.Types.ObjectId,
    ref: 'user',
   },
   fromDate:{
    type: Date,
    required: [true , 'Form Date is required'],
   },
   toDate:{
    type: Date,
    required: [true , 'Form Date is required'],
   }
 
  
} , {timestamps: true , versionKey: false})

export const couponModel = mongoose.model('coupon', couponSchema)

