import Joi from "joi";
import {generalFiled} from "../../middlewares/generalFields.js";


const createBrandValidation = {
    body:  Joi.object({
            name: Joi.string().required()
        }).required()
    ,
    file: generalFiled.file.required(),
 headers: Joi.object({
    token: Joi.string().required()  
  }).unknown(true)}

const updateBrandValidation = {
    body:  Joi.object({
            name: Joi.string().required()
        }).required()
    ,
    file: generalFiled.file,
 headers: Joi.object({
    token: Joi.string().required()  
  }).unknown(true)}
export{
    createBrandValidation ,    updateBrandValidation}
