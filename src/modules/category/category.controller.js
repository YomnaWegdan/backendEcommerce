import { categoryModel } from "../../models/category.model.js"
import { appError } from "../../utilities/appError.js"
import { catchError } from "../../middlewares/asyncHandlerError.js"
import  cloudinary  from "../../utilities/cloudinary.js"
import { nanoid } from "nanoid"
import slugify from "slugify"
import { subcategoryModel } from "../../models/subCategory.model.js"
const createCategory = catchError( async (req , res , next) =>{
    
    const {name} = req.body
    const categoryExist = await categoryModel.findOne({name: name.toLowerCase()})
    console.log(req.user)

    if(categoryExist) return next(new appError('category already exist' , 404))
    if(!req.file) return next(new appError('image is required' , 404))

        const customId = nanoid(5)
        let { secure_url, public_id } = await cloudinary.uploader
        .upload(req.file.path, {
            folder:`E-commerce/Categories/${customId}`,
            }
        ) 
        req.filepath = `E-commerce/Categories/${customId}`
        

    const category = await categoryModel.create({
        name ,
        slug:slugify(name, {replacement: "_" , lower: true}) ,
        image:{secure_url , public_id} ,
        customId, 
        createdBy:req.user._id
    })

    req.data = {
        model:categoryModel,
        id:category._id
    }
    res.status(201).json({message :'success' , category })
})

const getCategory = catchError( async (req , res , next) =>{
    // const categories = await categoryModel.find({}).populate([{path:'subCategories'}])

    
        const ApiFeatures = new ApiFeatures(categoryModel.find({}).populate([{path:'subCategories'}]) , req.query)
        .pagination()
        .filter()
        .sort()
        .select()
        .search()

    const categories = await ApiFeatures.mongooseQuery

    if(!categories) return next(new appError('category not found' , 404))

    res.status(201).json({message :'success' , categories  })
})

const updateCategory = catchError( async (req , res , next) =>{

    const {name} = req.body
    const {id} = req.params

    const category = await categoryModel.findOne({_id:id , createdBy:req.user._id})

    

    if(!category) return next(new appError('category not found' , 404))
    
    if(name){
        // if(name.toLowerCase() === category.name.toLowerCase()) return next(new appError('category already exist' , 404))
        if( await categoryModel.findOne({name: name.toLowerCase()})) return next(new appError('category already exist' , 404))
        category.name = name.toLowerCase()
        category.slug = slugify(name, {replacement: "_" , lower: true})
        }
    if(req.file){
        await cloudinary.uploader.destroy(category.image.public_id)
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path , {
            folder:`E-commerce/Categories/${category.customId}`
        })
        category.image = {secure_url , public_id}
    }

    await category.save()

   
    res.status(200).json({message :'success' , category })
})


const deleteCategory = catchError( async (req , res , next) =>{

    const {id} = req.params
    const category = await categoryModel.findOneAndDelete({_id:id , createdBy:req.user._id})
    if(!category) return next(new appError('category not found' , 404))

    await subcategoryModel.deleteMany({category:category._id})

    await cloudinary.api.delete_resources_by_prefix(`E-commerce/Categories/${category.customId}`)
    await cloudinary.api.delete_folder(`E-commerce/Categories/${category.customId}`)

    

    res.status(200).json({message :'delete successful' , category })
})
export{createCategory , updateCategory , getCategory , deleteCategory}





// const getCategory = catchError( async (req , res , next) =>{
//     let categoriesList = []
//     const categories = await categoryModel.find({})
//     for(const category of categories){
//         const subcategory = await subcategoryModel.find({category:category._id})
//         const newCategory = category.toObject()
//         newCategory.subcategory = subcategory
//         categoriesList.push(newCategory)

//     }
//     if(!categories) return next(new appError('subcategory is not found' , 404))

//     res.status(201).json({message :'success' , categories : categoriesList })
// })

