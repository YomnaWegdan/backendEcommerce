import { catchError } from "./asyncHandlerError.js"
import {userModel} from "../models/user.model.js"
import jwt from "jsonwebtoken"
export const auth = () => {
    return catchError(async (req, res, next) => {

        const { token } = req.headers
        if (!token) {
            return res.status(400).json({ msg: "token not exist" })
        }
       
        const decoded = jwt.verify(token, process.env.signatureKey)
        if (!decoded?.email) {
            return res.status(400).json({ msg: "invalid token payload" })
        }
        const user = await userModel.findOne({ email: decoded.email })
        if (!user) {
            return res.status(409).json({ msg: "user not exist" })
        }
     
        if (user?.passwordChangeAt) {
            if (parseInt(user?.passwordChangeAt?.getTime() / 1000) > decoded.iat) {
                return res.status(400).json({ msg: "password changed please login again" });
            }
        } else {
            console.warn('passwordChangeAt is undefined for user:', user._id);
        }
        

        req.user = user
        next()

    })

}


