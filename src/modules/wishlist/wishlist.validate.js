import Joi from "joi";
import {generalFiled} from "../../middlewares/generalFields.js";


const createWishlistValidation = {    
    params:Joi.object({
        productId:generalFiled.id.required()
    }),
 headers: Joi.object({
    token: Joi.string().required()  
  }).unknown(true)};
const deleteWishlistValidation = {
    params:Joi.object({
        id:generalFiled.id.required(),
        productId:generalFiled.id.required()
    }),
 headers: Joi.object({
    token: Joi.string().required()  
  }).unknown(true)}

export{createWishlistValidation , deleteWishlistValidation }
