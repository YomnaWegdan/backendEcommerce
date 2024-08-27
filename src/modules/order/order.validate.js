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
    headers: generalFiled.headers.required()
}

const cancelOrderValidation = {
    body:  Joi.object({
        reason:Joi.string().required(),
        }).required()
    ,
    params:Joi.object({
        id:generalFiled.id.required()
    }),
    headers: generalFiled.headers.required()
}
export{
    createOrderValidation , cancelOrderValidation}