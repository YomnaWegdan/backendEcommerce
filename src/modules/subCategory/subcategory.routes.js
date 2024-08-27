import { Router } from "express";
import * as SC from "./subcategory.controller.js"
import { multerHost, validExtensions } from "../../middlewares/multer.js";
import {auth} from "../../middlewares/auth.js"
import {validation} from "../../middlewares/validate.js"
import * as SV from "./subcategory.validate.js";

export const subcategoryRouter = Router({mergeParams : true})
subcategoryRouter.get('/'  ,auth(["admin" , "user"])  ,  SC.getSubCategory)

subcategoryRouter.post('/' , multerHost(validExtensions.image).single('image') , validation(SV.createSubCategoryValidation), auth(["admin"]) ,  SC.createSubCategory)
subcategoryRouter.put('/:id' ,   multerHost(validExtensions.image).single('image'), validation(SV.updateSubCategoryValidation), auth(["admin"]) , SC.updateSubCategory)

// categoryRouter.post('/' , multerHost(validExtensions.image).single('image') , validate(CV.createCategoryValidation) , auth("admin")  , CC.createCategory