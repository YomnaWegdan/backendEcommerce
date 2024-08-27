import Joi from "joi";
import {generalFiled} from "../../middlewares/generalFields.js";


const createWishlistValidation = {    
    params:Joi.object({
        productId:generalFiled.id.required()
    }),
    headers: generalFiled.headers.required(),
};
const deleteWishlistValidation = {
    params:Joi.object({
        id:generalFiled.id.required(),
        productId:generalFiled.id.required()
    }),
    headers: generalFiled.headers.required(),
}

export{createWishlistValidation , deleteWishlistValidation }
