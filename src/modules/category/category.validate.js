import Joi from "joi";
import {generalFiled} from "../../middlewares/generalFields.js";


const createCategoryValidation = {
    body:  Joi.object({
            name: Joi.string().required()
        }).required()
    ,
    file: generalFiled.file.required(),
    // headers: generalFiled.headers.required()
    headers: Joi.object({
    token: Joi.string().required()  
  }).unknown(true)
}

const updateCategoryValidation = {
    body:  Joi.object({
            name: Joi.string().required()
        }).required()
    ,
    file: generalFiled.file,
 headers: Joi.object({
    token: Joi.string().required()  
  }).unknown(true)}
export{
    createCategoryValidation , updateCategoryValidation}
