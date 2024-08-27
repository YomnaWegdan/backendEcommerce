import { Router } from "express";
import * as RC from "./review.controller.js"
import {auth} from "../../middlewares/auth.js"
import {validation} from "../../middlewares/validate.js"
import * as RV from "./review.validate.js";

export const reviewRouter = Router( {mergeParams : true} )

reviewRouter.post('/', validation(RV.createReviewValidation), auth(["admin" , "user"]) ,  RC.createReview)
reviewRouter.delete('/:reviewId' ,validation(RV.deleteReviewValidation), auth(["admin" , "user"]) , RC.deleteReview)

