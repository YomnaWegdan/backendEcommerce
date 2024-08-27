import { Router } from "express";
import * as OC from "./order.controller.js"
import {auth} from "../../middlewares/auth.js"
import {validation} from "../../middlewares/validate.js"
import * as OV from "./order.validate.js";

export const orderRouter = Router()

orderRouter.post('/' , validation(OV.createOrderValidation), auth(["admin" , "user"]) ,  OC.createOrder)
orderRouter.put('/:id' , validation(OV.cancelOrderValidation), auth(["admin" , "user"]) ,  OC.cancelOrder)


