import { appError } from "../../utilities/appError.js"
import { catchError } from "../../middlewares/asyncHandlerError.js"
import { productModel } from "../../models/product.model.js"
import { wishlistModel } from "../../models/wishlist.model.js"
const createWishlist = catchError( async (req , res , next) =>{

    const { productId } = req.params;    
    const productExist = await productModel.findOne({ _id: productId });
    if (!productExist) return next(new appError('Product not found', 404));
    
    const wishlistExist = await wishlistModel.findOne({ user: req.user._id });
    if (!wishlistExist) {
        const wishlist = await wishlistModel.create({
            user: req.user._id,
            products: [productId]
        });
        return res.status(201).json({ message: 'Success', wishlist });
    }

    await wishlistModel.updateOne(
        { user: req.user._id },
        { $addToSet: { products: productId } } 
    );
    res.status(201).json({ message: 'Success', wishlist: wishlistExist });


})

const deleteWishlist = catchError( async (req , res , next) =>{

        const { productId } = req.params;
    
        const wishlist = await wishlistModel.findOne({ user: req.user._id });
        if (!wishlist) return next(new appError('Wishlist not found', 404));
    
        const productIndex = wishlist.products.indexOf(productId);
        if (productIndex === -1) return next(new appError('Product not found in wishlist', 404));
    
        wishlist.products.splice(productIndex, 1);
        await wishlist.save();
    
        res.status(200).json({ message: 'Product removed from wishlist', wishlist });
    });
    


export{ createWishlist , deleteWishlist }