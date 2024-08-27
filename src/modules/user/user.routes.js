import { Router } from "express";
import * as UC from "./user.controller.js"

export const userRouter = Router()

userRouter.post('/signup' , UC.signUP)
userRouter.get('/verify/:token' , UC.verifyEmail)
userRouter.get('/refreshToken/:refreshToken' , UC.refreshToken)
userRouter.patch('/sendCode' , UC.forgetPassword)
userRouter.patch('/resetPassword' , UC.resetPassword)
userRouter.post('/signin' , UC.signIn)
