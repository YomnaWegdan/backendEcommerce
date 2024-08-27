import { Router } from "express";
import * as CC from "./category.controller.js"
import { multerHost, validExtensions } from "../../middlewares/multer.js";
import {auth} from "../../middlewares/auth.js"
import {validation} from "../../middlewares/validate.js"
import * as CV from "./category.validate.js";
import { subcategoryRouter } from "../subCategory/subcategory.routes.js";

export const categoryRouter = Router()

categoryRouter.use('/:categoryId/subCategories' , subcategoryRouter)
categoryRouter.get('/'  ,auth(["admin" , "user"]) , CC.getCategory)

categoryRouter.post('/' , multerHost(validExtensions.image).single('image') , validation(CV.createCategoryValidation), auth(["admin"]) ,  CC.createCategory)
categoryRouter.put('/:id' ,   multerHost(validExtensions.image).single('image'), validation(CV.updateCategoryValidation), auth(["admin"]) , CC.updateCategory)
categoryRouter.delete('/:id'  ,auth(["admin" , "user"]) , CC.deleteCategory)

// categoryRouter.post('/' , multerHost(validExtensions.image).single('image') , validate(CV.createCategoryValidation) , auth("admin")  , CC.createCategory)