import Stripe from "stripe";


export async function payment ({
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY),
    payment_method_types= ['card'],
    mode= 'payment',
    customer_email,
    metadata={},
    success_url,
    cancel_url,
    line_items=[],
    discounts=[]}={}
    ){
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
    const session = await stripe.checkout.sessions.create({
        payment_method_types,
        mode,
        customer_email,
        metadata,
        success_url,
        cancel_url,
        line_items,
        discounts
    })
    return session
}


/*
export async function payment({
    payment_method_types = ['card'],
    mode = 'payment',
    customer_email,
    metadata = {},
    success_url,
    cancel_url,
    line_items = [],
    discounts = []
} = {}) {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY); // Initialize once
    const session = await stripe.checkout.sessions.create({
        payment_method_types,
        mode,
        customer_email,
        metadata,
        success_url,
        cancel_url,
        line_items,
        discounts
    });
    return session;
*/