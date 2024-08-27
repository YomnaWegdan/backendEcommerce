import mongoose, { Schema } from "mongoose";

const ordersSchema  = new Schema({
    user:{type:Schema.Types.ObjectId , ref:'user' , required:true},
    products:[{
        title:{type:String , required:true},
        productId:{type:Schema.Types.ObjectId , ref:'product' , required:true},
        quantity:{type:Number , required:true},
        price:{type:Number , required:true},
        finalPrice:{type:Number , required:true}
    }],
    subPrice:{type:Number , required:true},
    totalPrice:{type:Number , required:true},
    couponId:{type:Schema.Types.ObjectId , ref:'coupon'},
    address:{type:String , required:true},
    phone:{type:String , required:true},
    paymentMethod:{type:String , required:true , enum:['card' , 'cash']},
    status:{type:String , required:true , enum:['placed' , 'waitPayment'  , 'delivered', 'onMany', 'cancelled' , 'rejected']},
    cancelledBy:{type:Schema.Types.ObjectId , ref:'user'},
    reason:{type:String}
  
} , {timestamps: true , versionKey: false})

export const ordersModel = mongoose.model('orders', ordersSchema)