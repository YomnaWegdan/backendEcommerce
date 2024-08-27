import { Router } from "express";
import * as WC from "./wishlist.controller.js"
import {auth} from "../../middlewares/auth.js"
import {validation} from "../../middlewares/validate.js"
import * as WV from "./wishlist.validate.js";

export const wishlistRouter = Router( {mergeParams : true} )

wishlistRouter.post('/', validation(WV.createWishlistValidation), auth(["admin" , "user"]) ,  WC.createWishlist)
wishlistRouter.delete('/:id' ,validation(WV.deleteWishlistValidation), auth(["admin" , "user"]) , WC.deleteWishlist)

