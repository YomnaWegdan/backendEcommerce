import mongoose, { Schema } from "mongoose";

const cartSchema  = new Schema({
 user:{
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true
 },
 products:[{
   productId:{
    type: Schema.Types.ObjectId,
    ref: 'product',
    required: true
   },
   quantity:{
    type: Number,
    required: true
   }
 }],
 
} , {timestamps: true , versionKey: false})

export const cartModel = mongoose.model('cart', cartSchema)