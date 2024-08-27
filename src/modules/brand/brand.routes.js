import { Router } from "express";
import * as BC from "./brand.controller.js"
import { multerHost, validExtensions } from "../../middlewares/multer.js";
import {auth} from "../../middlewares/auth.js"
import {validation} from "../../middlewares/validate.js"
import * as BV from "./brand.validate.js";

export const brandRouter = Router()
brandRouter.get('/' , auth(["admin" , "user"]) ,  BC.getBrands)

brandRouter.post('/' , multerHost(validExtensions.image).single('image') , validation(BV.createBrandValidation), auth(["admin"]) ,  BC.createBrand)
brandRouter.put('/:id' ,   multerHost(validExtensions.image).single('image'), validation(BV.updateBrandValidation), auth(["admin"]) , BC.updateBrand)

// categoryRouter.post('/' , multerHost(validExtensions.image).single('image') , validate(CV.createCategoryValidation) , auth("admin")  , CC.createCategory)