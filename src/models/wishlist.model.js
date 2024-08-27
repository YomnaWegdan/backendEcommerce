import mongoose, { Schema } from "mongoose";

const wishlistSchema  = new Schema({
    user:{type:Schema.Types.ObjectId , ref:'user' , required:true},
    products:[{type:Schema.Types.ObjectId , ref:'product' , required:true}],
  

} , {timestamps: true , versionKey: false})

export const wishlistModel = mongoose.model('wishlist', wishlistSchema)