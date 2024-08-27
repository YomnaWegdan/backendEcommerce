import Joi from "joi";
import {generalFiled} from "../../middlewares/generalFields.js";


const createCartValidation = {
    body:  Joi.object({
           productId:generalFiled.id.required(),
           quantity:Joi.number().integer().min(1).required()
        }).required()
    ,
 headers: Joi.object({
    token: Joi.string().required()  
  }).unknown(true)

}

const removeCartValidation = {
    body:  Joi.object({
           productId:generalFiled.id.required(),
        }).required()
    ,
 headers: Joi.object({
    token: Joi.string().required()  
  }).unknown(true)
}
const clearCartValidation = {
   
 headers: Joi.object({
    token: Joi.string().required()  
  }).unknown(true)
}
export{
    createCartValidation  , removeCartValidation , clearCartValidation}
