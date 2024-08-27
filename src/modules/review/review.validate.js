import Joi from "joi";
import {generalFiled} from "../../middlewares/generalFields.js";


const createReviewValidation = {
    body: Joi.object({
       comment: Joi.string().required(),
       rate: Joi.number().min(1).max(5).required(),
    }).required(),
    params:Joi.object({
        productId:generalFiled.id.required()
    }),
 headers: Joi.object({
    token: Joi.string().required()  
  }).unknown(true)};
const deleteReviewValidation = {
    params:Joi.object({
        productId: generalFiled.id.required(),
        reviewId: generalFiled.id.required(),
    }),
 headers: Joi.object({
    token: Joi.string().required()  
  }).unknown(true)}

export{createReviewValidation , deleteReviewValidation }
