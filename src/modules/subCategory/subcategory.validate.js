import Joi from "joi";
import {generalFiled} from "../../middlewares/generalFields.js";


const createSubCategoryValidation = {
    body:  Joi.object({
            name: Joi.string().required(),

        }).required(),
    params:Joi.object({
        categoryId:generalFiled.id.required()
    }),
    // file: generalFiled.file.required(),
 headers: Joi.object({
    token: Joi.string().required()  
  }).unknown(true)}

const updateSubCategoryValidation = {
    body:  Joi.object({
            name: Joi.string().required()
        }).required()
    ,
    file: generalFiled.file,
 headers: Joi.object({
    token: Joi.string().required()  
  }).unknown(true)}
export{
    createSubCategoryValidation , updateSubCategoryValidation}
