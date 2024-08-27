import mongoose, { Schema } from "mongoose";

const reviewSchema  = new Schema({
    comment: {
        type: String,
        required: [true , 'comment is required'],
        trim: true
    },
    rate: {
        type: Number,
        required: [true , 'rating is required'],
        min:1,
        max:5
    },
    productId:{
        type: Schema.Types.ObjectId,
        ref: 'product',
        required: true
    },
    createdBy:{
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    }
    
 
  
} , {timestamps: true , versionKey: false})

export const reviewModel = mongoose.model('reviews', reviewSchema)