import { Router } from "express";
import * as CC from "./coupon.controller.js"
import {auth} from "../../middlewares/auth.js"
import {validation} from "../../middlewares/validate.js"
import * as CV from "./coupon.validate.js";

export const couponRouter = Router()

couponRouter.post('/', validation(CV.createCouponValidation), auth(["admin"]) ,  CC.createCoupon)
// couponRouter.put('/:id' ,   multerHost(validExtensions.image).single('image'), validation(CV.updateCouponValidation), auth(["admin"]) , CC.updateBrand)

