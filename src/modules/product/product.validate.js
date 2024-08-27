import Joi from "joi";
import {generalFiled} from "../../middlewares/generalFields.js";


const createProductValidation = {
    body:  Joi.object({
            title: Joi.string().required(),
            slug:Joi.string(),
            description:Joi.string().required(),
            price:Joi.number().required(),
            discount:Joi.number().optional(),
            stoke:Joi.number().integer().required(),
            category:generalFiled.id.required(),
            subCategory:generalFiled.id.required(),
            brand:generalFiled.id.required(),

        }).required(),
        files:Joi.object({
            image:Joi.array().items( generalFiled.file.required()).required(),
            coverImages:Joi.array().items( generalFiled.file.required()).required()

        }).required(),

    // file: generalFiled.file.required(),
    headers: generalFiled.headers.required()
}

const updateProductValidation = {
    body:  Joi.object({
        title: Joi.string().optional(),
        slug:Joi.string(),
        description:Joi.string().optional(),
        price:Joi.number().optional(),
        discount:Joi.number().optional(),
        stoke:Joi.number().integer().optional(),
        category:generalFiled.id.required(),
        subCategory:generalFiled.id.required(),
        brand:generalFiled.id.required()}),
    params:Joi.object({
        id:generalFiled.id.required()
    }),

    files:Joi.object({
            image:Joi.array().items( generalFiled.file.required()).required(),
            coverImages:Joi.array().items( generalFiled.file.required()).required()

    }),
    headers: generalFiled.headers.required()
}
export{
    createProductValidation , updateProductValidation}