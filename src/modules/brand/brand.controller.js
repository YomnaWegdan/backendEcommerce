import { categoryModel } from "../../models/category.model.js"
import { appError } from "../../utilities/appError.js"
import { catchError } from "../../middlewares/asyncHandlerError.js"
import  cloudinary  from "../../utilities/cloudinary.js"
import { nanoid } from "nanoid"
import slugify from "slugify"
import { brandsModel } from "../../models/brands.model.js"
const createBrand = catchError( async (req , res , next) =>{
    const {name} = req.body
    const brandExist = await brandsModel.findOne({name: name.toLowerCase()})

    if(brandExist) return next(new appError('brand already exist' , 404))
    if(!req.file) return next(new appError('image is required' , 404))

        const customId = nanoid(5)
        let { secure_url, public_id } = await cloudinary.uploader
        .upload(req.file.path, {
            folder:`E-commerce/Brands/${customId}`,
            }
        )
        .catch((error) => {
            console.log(error);
        });

    const brand = await brandsModel.create({
        name ,
        slug:slugify(name, {replacement: "_" , lower: true}) ,
        image:{secure_url , public_id} ,
        customId, 
        createdBy:req.user._id
    })

    res.status(201).json({message :'success' , brand })
})

const getBrands = catchError( async (req , res , next) =>{

    const brands = await brandsModel.find({}).populate([{path:'createdBy'}])
    // .populate([{path:'category'} , {path:'createdBy'}])
    if(!brands) return next(new appError('brands is not found' , 404))

    res.status(201).json({message :'success' , brands })
})

const updateBrand = catchError( async (req , res , next) =>{

    const {name} = req.body
    const {id} = req.params

    const brand = await brandsModel.findOne({_id:id , createdBy:req.user._id})

    

    if(!brand) return next(new appError('brand not found' , 404))
    
    if(name){
        // if(name.toLowerCase() === category.name.toLowerCase()) return next(new appError('category already exist' , 404))
        if( await brandsModel.findOne({name: name.toLowerCase()})) return next(new appError('brand already exist' , 404))
        brand.name = name.toLowerCase()
        brand.slug = slugify(name, {replacement: "_" , lower: true})
        }
    if(req.file){
        await cloudinary.uploader.destroy(brand.image.public_id)
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path , {
            folder:`E-commerce/Brands/${brand.customId}`
        })
        brand.image = {secure_url , public_id}
    }

    await brand.save()

   
    res.status(200).json({message :'success' , brand })
})
export{ createBrand , updateBrand , getBrands}
