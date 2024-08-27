import { appError } from "../../utilities/appError.js"
import { catchError } from "../../middlewares/asyncHandlerError.js"

import { cartModel } from "../../models/cart.model.js"
import { productModel } from "../../models/product.model.js"
const createCart = catchError( async (req , res , next) =>{
    const { productId , quantity } = req.body
    const productExist = await productModel.findOne({_id:productId , stoke:{$gte: quantity}})

    if(!productExist) return next(new appError('product not found' , 404))

    const cartExist = await cartModel.findOne({user:req.user._id})

    if(!cartExist){
        const cart = await cartModel.create({
            user:req.user._id,
            products:[{productId , quantity}]
        })

    return res.status(201).json({message :'success' , cart })
    }

    let flag = false
    for(let product of cartExist.products){
        if(product.productId == productId){
            product.quantity = quantity
            flag = true
        }
    }
    if(!flag){
        cartExist.products.push({productId , quantity}) 
    }
    
    await cartExist.save()
    res.status(201).json({message :'success' , cartExist }) 
})


const removeCart = catchError( async (req , res , next) =>{
    const { productId } = req.body
    const cart = await cartModel.findOneAndUpdate({user:req.user._id , "products.productId":productId} ,
        {$pull:{products:{productId}} , new:true})
   
    res.status(201).json({message :'success' , cart }) 
})

const clearCart = catchError( async (req , res , next) =>{
    const cart = await cartModel.findOneAndUpdate({user:req.user._id } ,{products:[] , new:true})
   
    res.status(201).json({message :'success' , cart }) 
})


export{ createCart , removeCart , clearCart}
