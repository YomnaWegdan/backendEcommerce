import { Router } from "express";
import * as PC from "./product.controller.js"
import { reviewRouter } from "../review/review.routes.js";
import { wishlistRouter } from "../wishlist/wishlist.routes.js";

import { multerHost, validExtensions } from "../../middlewares/multer.js";
import {auth} from "../../middlewares/auth.js"
import {validation} from "../../middlewares/validate.js"
import * as PV from "./product.validate.js";

export const productRouter = Router({mergeParams : true})

productRouter.use('/:productId/reviews' , reviewRouter)

productRouter.use('/:productId/wishlists' , wishlistRouter)



productRouter.get('/'   ,  PC.getAllProducts)


productRouter.post('/' , multerHost(validExtensions.image).fields([{name : "image" , maxCount : 1} , {name:"coverImages" , maxCount : 3} ]) , validation(PV.createProductValidation), auth(["admin"]) ,  PC.createProduct)
productRouter.put('/:id' , multerHost(validExtensions.image).fields([{name : "image" , maxCount : 1} , {name:"coverImages" , maxCount : 3} ]) , validation(PV.updateProductValidation), auth(["admin"]) , PC.updateProduct)

