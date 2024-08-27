import { appError } from "../../utilities/appError.js"
import { catchError } from "../../middlewares/asyncHandlerError.js"
import  cloudinary  from "../../utilities/cloudinary.js"
import { nanoid } from "nanoid"
import slugify from "slugify"
import { productModel } from "../../models/product.model.js"
import { categoryModel } from "../../models/category.model.js"
import { subcategoryModel } from "../../models/subCategory.model.js"
import { brandsModel } from "../../models/brands.model.js"
const createProduct = catchError( async (req , res , next) =>{
    const {title , description , slug  , category , subCategory , discount , price , brand} = req.body

    const categoryExist = await categoryModel.findOne({_id:category})
    if(!categoryExist) return next(new appError('category not found' , 404))

    const subcategoryExist = await subcategoryModel.findOne({_id:subCategory , category})
    if(!subcategoryExist) return next(new appError('subcategory not found' , 404))

    const brandExist = await brandsModel.findOne({_id:brand})
    if(!brandExist) return next(new appError('brand not found' , 404))
    
    const productExist = await productModel.findOne({title: title.toLowerCase()})
    if(productExist) return next(new appError('product already exist' , 404))

    const subPrice = price - ( price * ( discount || 0 ) / 100 )

    if(!req.files) return next(new appError('image is required' , 404))

    let list =[]
    const customId = nanoid(5)
    for(const file of req.files.coverImages){
        const { secure_url, public_id } = await cloudinary.uploader.upload(file.path , { 
            folder:`E-commerce/Categories/${categoryExist.customId}/subCategories/${subcategoryExist.customId}/products/${customId}/coverImages`,
        })
        list.push({secure_url , public_id})
    }

    const { secure_url, public_id } = await cloudinary.uploader.upload(req.files.image[0].path , {
        folder:`E-commerce/Categories/${categoryExist.customId}/subCategories/${subcategoryExist.customId}/products/${customId}/mainImage`,
    })
    const product = await productModel.create({
        title , slug:slugify(title, {replacement: "_" , lower: true}) , description , category , subCategory , brand , discount , price , subPrice , customId , image:{secure_url , public_id} , coverImages:list , createdBy:req.user._id   
    })
    res.status(201).json({message :'success' , product })
})

const getAllProducts = catchError( async (req , res , next) =>{


   

    const ApiFeatures = new ApiFeatures(productModel.find({}) , req.query)
        .pagination()
        .filter()
        .sort()
        .select()
        .search()

    const products = await ApiFeatures.mongooseQuery

    if(!products) return next(new appError('product is not found' , 404))

    res.status(201).json({message :'success' ,page:ApiFeatures.page , products })
})



const updateProduct = catchError( async (req , res , next) =>{

//     const {name , category} = req.body
    const {description , slug  , category , subCategory , discount , price , brand} = req.body

    const {id} = req.params

    const categoryExist = await categoryModel.findOne({ _id:category })
    if(!categoryExist) return next(new appError('category not found' , 404))
        
    const subcategoryExist = await subcategoryModel.findOne({_id:subCategory , category})   
    if(!subcategoryExist) return next(new appError('sub category not found' , 404))

    const brandExist = await brandsModel.findOne({_id:brand })   
    if(!brandExist) return next(new appError('brand not found' , 404))

    const product = await productModel.findOne({_id:id , createdBy:req.user._id})   
    if(!product) return next(new appError('product not found' , 404))

    if(title){
       if(title.toLowerCase() == product.title){
            return next(new appError('title match old title' , 404))
       }
       if( await productModel.findOne({title: title.toLowerCase()})){
            return next(new appError('product title already exist' , 404))
       }
       product.title = title.toLowerCase()
       product.slug = slugify(title, {replacement: "_" , lower: true})
    }

    if(description) product.description = description

    if(stoke) product.stoke = stoke

    if(price & discount) {
        product.subPrice = price - ( price * ( discount || 0 ) / 100 )
        product.discount = discount
        product.price = price
    }
    else if(price){ 
        product.subPrice =  price - ( price * ( product.discount || 0 ) / 100 )
        product.price = price
    }
    else if(discount){ 
        product.subPrice =  product.price - ( product.price * ( discount || 0 ) / 100 )
        product.discount = discount
    }

    if(req.files){
        if(req.files?.image?.length){
            await cloudinary.uploader.destroy(product.image.public_id)
            const { secure_url, public_id } = await cloudinary.uploader.upload(req.files.image[0].path , { 
                folder:`E-commerce/Categories/${categoryExist.customId}/subCategories/${subcategoryExist.customId}/products/${product.customId}/mainImage`,
            })
            product.image = {secure_url , public_id}
        }
        if(req.files?.coverImages?.length){

            const list =[]
            for(const file of req.files.coverImages){
                await cloudinary.api.delete_resources_by_prefix(`E-commerce/Categories/${categoryExist.customId}/subCategories/${subcategoryExist.customId}/products/${product.customId}/coverImages`)
                const { secure_url, public_id } = await cloudinary.uploader.upload(file.path , { 
                    folder:`E-commerce/Categories/${categoryExist.customId}/subCategories/${subcategoryExist.customId}/products/${product.customId}/coverImages`,
                })
                list.push({secure_url , public_id})
            }
            product.coverImages = list
        }
    }

     await product.save()
     res.status(201).json({message :'update successful' , product })
    
    
     
//   
})
export{ createProduct  , updateProduct , getAllProducts} 
