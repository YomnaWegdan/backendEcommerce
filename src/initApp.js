import { dbConnection } from '../database/dbConnection.js'
import cors from 'cors'
import { globalError } from "./middlewares/asyncHandlerError.js"
import * as routers from './modules/index.routes.js'
import { webHook } from './modules/order/order.controller.js'
import { appError } from './utilities/appError.js'
import { deleteFromCloudinary } from './utilities/deleteFromCloudinary.js'
import { deleteFromDatabase } from './utilities/deleteFromDatabase.js'
export const initApp = (app , express)=>{
    app.use(cors())
    routers.orderRouter.post('/webhook', express.raw({type: 'application/json'}), webHook);

app.use(express.json())

app.get('/', (req, res) => res.status(200).json({message: 'success'}));


app.use('/auth' , routers.userRouter)
app.use('/categories' , routers.categoryRouter)
app.use('/subcategories' , routers.subcategoryRouter)
app.use('/brands' , routers.brandRouter)
app.use('/products' , routers.productRouter)
app.use('/coupons' , routers.couponRouter)
app.use('/cart' , routers.cartRouter)
app.use('/orders' , routers.orderRouter)
app.use('/reviews' , routers.reviewRouter)
app.use('/wishlists' , routers.wishlistRouter)

dbConnection()

app.use('*' , (req , res , next)=> next(new appError('route not found ${req.originalUrl}'),404) )

app.use( globalError , deleteFromCloudinary , deleteFromDatabase) 

//handle error outside express
app.get('/', (req, res) => res.send('Hello World!'))
}
