import { subcategoryModel } from "../../models/subCategory.model.js"
import { appError } from "../../utilities/appError.js"
import { catchError } from "../../middlewares/asyncHandlerError.js"
import  cloudinary  from "../../utilities/cloudinary.js"
import { nanoid } from "nanoid"
import slugify from "slugify"
import { categoryModel } from "../../models/category.model.js"
const createSubCategory = catchError( async (req , res , next) =>{
    const {name } = req.body
    const categoryExist = await categoryModel.findById(req.params.categoryId)
    if(!categoryExist) return next(new appError('category not found' , 404))


    const subcategoryExist = await subcategoryModel.findOne({name: name.toLowerCase()})
    if(subcategoryExist) return next(new appError('subcategory already exist' , 404))

    if(!req.file) return next(new appError('image is required' , 404))

        const customId = nanoid(5)
        let { secure_url, public_id } = await cloudinary.uploader
        .upload(req.file.path, {
            folder:`E-commerce/Categories/${categoryExist.customId}/subCategories/${customId}`,
            }
        )
        .catch((error) => {
            console.log(error);
        });

    const subcategory = await subcategoryModel.create({
        name ,
        slug:slugify(name, {replacement: "_" , lower: true}) ,
        image:{secure_url , public_id} ,
        customId, 
        category:req.params.categoryId,
        createdBy:req.user._id
    })

    res.status(201).json({message :'success' , subcategory })
})

const getSubCategory = catchError( async (req , res , next) =>{

    const subcategories = await subcategoryModel.find({}).populate([{path:'category'} , {path:'createdBy'}])
    if(!subcategories) return next(new appError('subcategory is not found' , 404))

    res.status(201).json({message :'success' , subcategories })
})


const updateSubCategory = catchError( async (req , res , next) =>{

    const {name , category} = req.body
    const {id} = req.params

    const categoryExist = await categoryModel.findOne({ category , createdBy:req.user._id})
    if(!categoryExist) return next(new appError('category not found' , 404))
    
    const subcategory = await subcategoryModel.findOne({_id:id , createdBy:req.user._id})   
    if(!subcategory) return next(new appError('sub category not found' , 404))

     
    if(name){
        // if(name.toLowerCase() === category.name.toLowerCase()) return next(new appError('category already exist' , 404))
        if( await subcategoryModel.findOne({name: name.toLowerCase()})) return next(new appError('sub category already exist' , 404))
        subcategory.name = name.toLowerCase()
        subcategory.slug = slugify(name, {replacement: "_" , lower: true})
        }
    if(req.file){
        await cloudinary.uploader.destroy(category.image.public_id)
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path , {
            folder:`E-commerce/Categories/${categoryExist.customId}/subCategories/${subcategory.customId}`,

        })
        subcategory.image = {secure_url , public_id}
    }

    await subcategory.save()

   
    res.status(200).json({message :'success' , category })
})
export{createSubCategory , updateSubCategory , getSubCategory} 
