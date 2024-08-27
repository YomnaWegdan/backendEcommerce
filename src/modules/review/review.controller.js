import { appError } from "../../utilities/appError.js"
import { catchError } from "../../middlewares/asyncHandlerError.js"
import { reviewModel } from "../../models/review.model.js"
import { productModel } from "../../models/product.model.js"
import { ordersModel } from "../../models/orders.model.js"
const createReview = catchError( async (req , res , next) =>{
    const { rate , comment  } = req.body
    const {productId} = req.params
    const product = await productModel.findById(productId)
    if(!product){ return next(new appError('product id is required' , 404))}

    const reviewExist = await reviewModel.findOne({createdBy:req.user._id , productId})

    if(reviewExist) return next(new appError('review already exist' , 404))
    
    const orderExist = await ordersModel.findOne({user:req.user._id , "products.productId":productId , status:"delivered"})

    if(!orderExist) return next(new appError('order not found' , 404))

    const review = await reviewModel.create({
        rate,
        comment,
        createdBy:req.user._id,
        productId
    })

    const reviews = await reviewModel.find({productId})

    // let totalRate = 0
    // for(let review of reviews){
    //     totalRate += review.rate    
    // }   
    // product.rate = totalRate / reviews.length

    let totalRate = product.rateAvg * product.rateNum
    totalRate = totalRate + review.rate
    product.rateAvg = totalRate / (product.rateNum + 1)
    product.rateNum = product.rateNum + 1

    await product.save()


    res.status(201).json({message :'create successful' , review })

})

const deleteReview = catchError( async (req , res , next) =>{
   

    const { productId, reviewId } = req.params;

    const review = await reviewModel.findOneAndDelete({ createdBy: req.user._id, _id: reviewId });
    if (!review) return next(new appError('Review not found', 404));

    const product = await productModel.findById(productId);
    if (!product) return next(new appError('Product not found', 404));
    
    let totalRate = product.rateAvg * product.rateNum
    totalRate = totalRate - review.rate
    product.rateAvg = product.rateNum === 0 ? 0 : totalRate / product.rateNum;

    product.rateNum = product.rateNum - 1
    
    await product.save()

    res.status(200).json({message :'delete successful' , review })
    
})


export{ createReview , deleteReview }
