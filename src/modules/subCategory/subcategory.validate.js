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
    headers: generalFiled.headers.required()
}

const updateSubCategoryValidation = {
    body:  Joi.object({
            name: Joi.string().required()
        }).required()
    ,
    file: generalFiled.file,
    headers: generalFiled.headers.required()
}
export{
    createSubCategoryValidation , updateSubCategoryValidation}