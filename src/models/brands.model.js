import mongoose, { Schema } from "mongoose";

const brandsSchema  = new Schema({
    name: {
        type: String,
        required: [true , 'Name is required'],
        trim: true,
        unique: true
    },
    slug: {
        type: String,
        trim: true,
        unique: true
    },
    image:{
        secure_url: String,
        public_id: String
    },
    customId:String,
   createdBy:{
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true
   },
 
  
} , {timestamps: true , versionKey: false})

export const brandsModel = mongoose.model('brands', brandsSchema)