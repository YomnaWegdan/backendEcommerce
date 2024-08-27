import mongoose, { Schema } from "mongoose";

const categorySchema  = new Schema({
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
   },
  
} , {timestamps: true , versionKey: false ,
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
    }

)

categorySchema.virtual('subCategories', {
    ref: 'subcategory',
    localField: '_id',
    foreignField: 'category',
    
})
export const categoryModel = mongoose.model('category', categorySchema)