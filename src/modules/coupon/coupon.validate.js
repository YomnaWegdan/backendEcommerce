import Joi from "joi";
import {generalFiled} from "../../middlewares/generalFields.js";


const createCouponValidation = {
    body: Joi.object({
        code: Joi.string().required(),
        amount: Joi.number().integer().min(1).required(),
        fromDate: Joi.date().greater(Date.now()).required(),
        toDate: Joi.date().greater(Joi.ref('fromDate')).required(),
    }).required(),
    headers: Joi.object({
    token: Joi.string().required()  
  }).unknown(true)
};


export{createCouponValidation }
