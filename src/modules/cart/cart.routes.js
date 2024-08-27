import { Router } from "express";
import * as CC from "./cart.controller.js"
import {auth} from "../../middlewares/auth.js"
import {validation} from "../../middlewares/validate.js"
import * as CV from "./cart.validate.js";

export const cartRouter = Router()

cartRouter.post('/', validation(CV.createCartValidation), auth(["admin" , "user"]) ,  CC.createCart)
cartRouter.patch('/', validation(CV.removeCartValidation), auth(["admin" , "user"]) ,  CC.removeCart)
cartRouter.put('/', validation(CV.clearCartValidation), auth(["admin" , "user"]) ,  CC.clearCart)


