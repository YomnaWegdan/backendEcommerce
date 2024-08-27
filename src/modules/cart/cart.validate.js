import Joi from "joi";
import {generalFiled} from "../../middlewares/generalFields.js";


const createCartValidation = {
    body:  Joi.object({
           productId:generalFiled.id.required(),
           quantity:Joi.number().integer().min(1).required()
        }).required()
    ,
    headers: generalFiled.headers.required()
}

const removeCartValidation = {
    body:  Joi.object({
           productId:generalFiled.id.required(),
        }).required()
    ,
    headers: generalFiled.headers.required()
}
const clearCartValidation = {
   
    headers: generalFiled.headers.required()
}
export{
    createCartValidation  , removeCartValidation , clearCartValidation}