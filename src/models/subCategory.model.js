import mongoose, { Schema } from "mongoose";

const subCategorySchema  = new Schema({
    name: {
        type: String,
        required: [true , 'Name is required'],
        trim: true,
        unique: true
    },
    slug: {
        type: String,
        // required: [true , 'Slug is required'],
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
   category:{   //categoryId
    type: Schema.Types.ObjectId,
    ref: 'category',
    required: true
   }
  
} , {timestamps: true , versionKey: false})

export const subcategoryModel = mongoose.model('subcategory', subCategorySchema)