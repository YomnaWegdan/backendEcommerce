import Joi from "joi";
import {generalFiled} from "../../middlewares/generalFields.js";


const createBrandValidation = {
    body:  Joi.object({
            name: Joi.string().required()
        }).required()
    ,
    file: generalFiled.file.required(),
    headers: generalFiled.headers.required()
}

const updateBrandValidation = {
    body:  Joi.object({
            name: Joi.string().required()
        }).required()
    ,
    file: generalFiled.file,
    headers: generalFiled.headers.required()
}
export{
    createBrandValidation ,    updateBrandValidation}