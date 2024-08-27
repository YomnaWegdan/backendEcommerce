import { appError } from "../../utilities/appError.js"
import { catchError } from "../../middlewares/asyncHandlerError.js"
import { productModel } from "../../models/product.model.js"
import { couponModel } from "../../models/coupon.model.js"
import { ordersModel } from "../../models/orders.model.js"
import { cartModel } from "../../models/cart.model.js"
import {createInvoice} from '../../utilities/pdf.js'
import sendEmail from "../../utilities/email.js"
import { payment } from "../../utilities/payment.js"
import Stripe from 'stripe';


const createOrder = catchError( async (req , res , next) =>{
    const {productId , couponCode , quantity , address , phone , paymentMethod} = req.body
    if(couponCode){
        const coupon = await couponModel.findOne({code:couponCode.toLowerCase(), usedBy:{$nin:[req.user._id]}})
        if(!coupon) return next(new appError('coupon not found' , 404))
        if(new Date(coupon.expiry) < new Date()) return next(
            new appError('coupon expired' , 404))
        req.body.coupon = coupon
    }
    let products =[]
    let flag = false
    if(productId){
        products=[{productId , quantity}]
    }
    else{
        let cart =  await cartModel.findOne({user:req.user._id})
        if(!cart.products.length) return next(new appError('cart is empty ' , 404))
        products = cart.products
        flag = true
    }

    let finalProducts = []
    let subPrice =0
    for(let product of products){
        const productExist = await productModel.findOne({_id:product.productId , stoke:{$gte: product.quantity}})
        if(!productExist) return next(new appError('product not found' , 404))

        if(flag){
            product=product.toObject()
        }
        product.title=productExist.title
        product.price=productExist.price
        product.finalPrice=productExist.subPrice * product.quantity
        subPrice+= product.finalPrice

        finalProducts.push(product)

    }

    const order = await ordersModel.create({
        user:req.user._id,
        products:finalProducts,
        couponId:req.body.coupon?._id,
        subPrice,
        totalPrice:subPrice-subPrice * ((req.body.coupon?.discount || 0) / 100),
        address,
        phone,
        paymentMethod,
        status:paymentMethod == 'cash' ? 'placed' : 'waitPayment'
    })

    if(req.body?.coupon){
        await couponModel.findByIdAndUpdate({_id:req.body.coupon._id} ,{$push:{usedBy:req.user._id}})
    }

    for(let product of finalProducts){
        await productModel.findByIdAndUpdate({_id:product.productId} , {$inc:{stoke:-product.quantity}})
    }
    if(flag){
        await cartModel.updateOne({user:req.user._id} , {products:[]})
    }

    //to send invoice


const invoice = {
  shipping: {
    name: req.user.name,
    address: req.user.address,
    city: "cairo",
    state: "cairo",
    country: "Egypt",
    postal_code: 94111 
  },
  items: order.products,
  subtotal: subPrice,
  paid: order.totalPrice,
  invoice_nr: order._id,
  date:order.createdAt,
  coupon:req.body?.coupon?.amount || 0
};

await createInvoice(invoice, "invoice.pdf");

await sendEmail(req.user.email , `<h1>order places</h1>` , [
  {  path:"invoice.pdf",
    contentType: 'application/pdf'
  }

])

//payment
if(paymentMethod == 'card') {

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

    if(req.body?.coupon){
        const coupon = stripe.coupons.create({
            percent_off: req.body.coupon.amount,
            duration: 'once',
        })
        req.body.couponId = coupon.id
    }

 const session = await payment({
    payment_method_types: ['card'],
    mode: 'payment',
    customer_email: req.user.email,
    metadata: {
        orderId: order._id.toString()
    },
    success_url: `${req.protocol}://${req.hostname}/payment/success`,
    cancel_url: `${req.protocol}://${req.hostname}/payment/cancel`,
    line_items: order.products.map((product) => ({
        price_data: {
            currency: 'egp',
            unit_amount: product.price * 100,  
            product_data: {
                name: product.title
            }
        },
        quantity: product.quantity
    })),
    discounts: req.body?.coupon? [{coupon: req.body.couponId}] : [],
})

    res.status(201).json({message :'success' , order  , url:session.url , session})
}

})


const cancelOrder = catchError(async (req, res, next) => {
    const { reason } = req.body;
    const { id } = req.params;

    const order = await ordersModel.findOne({_id: id, user: req.user._id});
    
    if (!order) return next(new appError('Order not found', 404));

    if (order.paymentMethod === 'cash' && order.status !== 'placed') {
        return next(new appError('Order cannot be cancelled', 400));
    }

    await ordersModel.updateOne(
        { _id: id },
        { status: 'cancelled', cancelledBy: req.user._id, reason }
    );

    if (order.couponId) {
        await couponModel.updateOne({ _id: order.couponId }, { $pull: { usedBy: req.user._id } });
    }

    for (let product of order.products) {
        await productModel.updateOne({ _id: product.productId }, { $inc: { stock: product.quantity } });
    }

    res.status(200).json({ message: 'Cancel successful', order });
});



export {createOrder , cancelOrder }


/*
import Stripe from 'stripe';
import { appError } from "../../utilities/appError.js";
import { catchError } from "../../middlewares/asyncHandlerError.js";
import { productModel } from "../../models/product.model.js";
import { couponModel } from "../../models/coupon.model.js";
import { ordersModel } from "../../models/orders.model.js";
import { cartModel } from "../../models/cart.model.js";
import { createInvoice } from '../../utilities/pdf.js';
import sendEmail from "../../utilities/email.js";
import { payment } from "../../utilities/payment.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const createOrder = catchError(async (req, res, next) => {
    const { productId, couponCode, quantity, address, phone, paymentMethod } = req.body;

    if (couponCode) {
        const coupon = await couponModel.findOne({ code: couponCode.toLowerCase(), usedBy: { $nin: [req.user._id] } });
        if (!coupon) return next(new appError('Coupon not found', 404));
        if (new Date(coupon.expiry) < new Date()) return next(new appError('Coupon expired', 404));
        req.body.coupon = coupon;
    }

    let products = [];
    let flag = false;

    if (productId) {
        products = [{ productId, quantity }];
    } else {
        const cart = await cartModel.findOne({ user: req.user._id });
        if (!cart.products.length) return next(new appError('Cart is empty', 404));
        products = cart.products;
        flag = true;
    }

    let finalProducts = [];
    let subPrice = 0;

    for (let product of products) {
        const productExist = await productModel.findOne({ _id: product.productId, stoke: { $gte: product.quantity } });
        if (!productExist) return next(new appError('Product not found', 404));

        if (flag) {
            product = product.toObject();
        }
        product.title = productExist.title;
        product.price = productExist.price;
        product.finalPrice = productExist.price * product.quantity;
        subPrice += product.finalPrice;

        finalProducts.push(product);
    }

    const order = await ordersModel.create({
        user: req.user._id,
        products: finalProducts,
        couponId: req.body.coupon?._id,
        subPrice,
        totalPrice: subPrice - (subPrice * (req.body.coupon?.discount || 0) / 100),
        address,
        phone,
        paymentMethod,
        status: paymentMethod === 'cash' ? 'placed' : 'waitPayment'
    });

    if (req.body?.coupon) {
        await couponModel.findByIdAndUpdate({ _id: req.body.coupon._id }, { $push: { usedBy: req.user._id } });
    }

    for (let product of finalProducts) {
        await productModel.findByIdAndUpdate({ _id: product.productId }, { $inc: { stoke: -product.quantity } });
    }

    if (flag) {
        await cartModel.updateOne({ user: req.user._id }, { products: [] });
    }

    const invoice = {
        shipping: {
            name: req.user.name,
            address: req.user.address,
            city: "Cairo",
            state: "Cairo",
            country: "Egypt",
            postal_code: 94111
        },
        items: order.products,
        subtotal: subPrice,
        paid: order.totalPrice,
        invoice_nr: order._id,
        date: order.createdAt,
        coupon: req.body?.coupon?.amount || 0
    };

    await createInvoice(invoice, "invoice.pdf");
    await sendEmail(req.user.email, `<h1>Order Placed</h1>`, [
        { path: "invoice.pdf", contentType: 'application/pdf' }
    ]);

    if (paymentMethod === 'card') {
        const session = await payment({
            payment_method_types: ['card'],
            mode: 'payment',
            customer_email: req.user.email,
            metadata: { orderId: order._id.toString() },
            success_url: `${req.protocol}://${req.hostname}/payment/success`,
            cancel_url: `${req.protocol}://${req.hostname}/payment/cancel`,
            line_items: order.products.map((product) => ({
                price_data: {
                    currency: 'egp',
                    unit_amount: product.price * 100,  
                    product_data: { name: product.title }
                },
                quantity: product.quantity
            })),
            discounts: req.body?.coupon ? [{ coupon: req.body.couponId }] : []
        });

        res.status(201).json({ message: 'Success', order, url: session.url, session });
    } else {
        res.status(201).json({ message: 'Order placed successfully', order });
    }
});

const cancelOrder = catchError(async (req, res, next) => {
    const { reason } = req.body;
    const { id } = req.params;

    const order = await ordersModel.findOne({ _id: id, user: req.user._id });
    if (!order) return next(new appError('Order not found', 404));

    if (order.paymentMethod === 'cash' && order.status !== 'placed') {
        return next(new appError('Order cannot be cancelled', 400));
    }

    await ordersModel.updateOne(
        { _id: id },
        { status: 'cancelled', cancelledBy: req.user._id, reason }
    );

    if (order.couponId) {
        await couponModel.updateOne({ _id: order.couponId }, { $pull: { usedBy: req.user._id } });
    }

    for (let product of order.products) {
        await productModel.updateOne({ _id: product.productId }, { $inc: { stoke: product.quantity } });
    }

    res.status(200).json({ message: 'Cancel successful', order });
});

export { createOrder, cancelOrder };

*/