import mongoose, { Schema } from "mongoose";

const productSchema  = new Schema({
    title: {
        type: String,
        required: [true , 'Title is required'],
        trim: true,
        unique: true
    },
    slug: {
        type: String,
        // required: [true , 'Slug is required'],
        trim: true,
        unique: true
    },
    description: {
        type: String,
        // required: [true , 'Slug is required'],
        trim: true,
    },
    image:{
        secure_url: String,
        public_id: String
    },
    coverImages:[{
        secure_url: String,
        public_id: String
    }],
    customId:String,
   createdBy:{
    type: Schema.Types.ObjectId,
    ref: 'user',
    // required: true
   },
   category:{   //categoryId
    type: Schema.Types.ObjectId,
    ref: 'category',
    required: true
   },
   subCategory:{   //categoryId
    type: Schema.Types.ObjectId,
    ref: 'subcategory',
    required: true
   },
   brand:{   //categoryId
    type: Schema.Types.ObjectId,
    ref: 'brands',
    required: true
   },
   price: {
    type: Number,
    required: [true , 'Price is required'],
    min:1  
    } ,
    discount: {
    type: Number,
    min:1,
    default:1
    } ,
    subPrice: {
    type: Number,
    min:1
    },
    stoke: {
    type: Number,
    required: [true , 'Stoke is required'],
    default:1
    } ,
    rateAvg: {   
    type: Number,
    min:0,  
    default:0,
    max:5   
},
    rateNum: {   
    type: Number,
    min:0,  
    default:0
    }
  
} , {timestamps: true , versionKey: false ,
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
    }

)


export const productModel = mongoose.model('product', productSchema)