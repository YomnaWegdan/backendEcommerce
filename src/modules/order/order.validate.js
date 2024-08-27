import Joi from "joi";
import {generalFiled} from "../../middlewares/generalFields.js";


const createOrderValidation = {
    body:  Joi.object({
        productId:generalFiled.id.required(),
        quantity:Joi.number().integer().min(1).required(),
        address:Joi.string().required(),
        phone:Joi.string().required(),
        paymentMethod:Joi.string().valid('code','cash').required(),
        couponCode:Joi.string().optional(),
        }).required()
    ,
 headers: Joi.object({
    token: Joi.string().required()  
  }).unknown(true)
}

const cancelOrderValidation = {
    body:  Joi.object({
        reason:Joi.string().required(),
        }).required()
    ,
    params:Joi.object({
        id:generalFiled.id.required()
    }),
 headers: Joi.object({
    token: Joi.string().required()  
  }).unknown(true)
}
export{
    createOrderValidation , cancelOrderValidation}
