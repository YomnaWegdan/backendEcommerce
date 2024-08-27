import { appError } from "../../utilities/appError.js"
import { catchError } from "../../middlewares/asyncHandlerError.js"

import { couponModel } from "../../models/coupon.model.js"
const createCoupon = catchError( async (req , res , next) =>{
    const {code , amount , fromDate , toDate} = req.body
    const couponExist = await couponModel.findOne({code: code.toLowerCase()})

    if(couponExist) return next(new appError('coupon already exist' , 404))
    
    const coupon = await couponModel.create({
        code ,
        amount ,
        fromDate ,
        toDate,
        createdBy:req.user._id,
        usedBy:req.user._id
    })

    res.status(201).json({message :'success' , coupon })
})


export{ createCoupon}
