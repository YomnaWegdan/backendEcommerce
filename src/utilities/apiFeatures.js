export class ApiFeatures {
    constructor(mongooseQuery, queryString) {
        this.mongooseQuery = mongooseQuery
        this.queryString = queryString
    }  

    pagination(){
        const page = this.queryString.page * 1 || 1
        if (!page || page < 1) page = 1
        let limit = 2
        let skip = (page - 1) * limit

        this.mongooseQuery.find({}).skip(skip).limit(limit)
        this.page = page
        return this
    }

    filter(){
        const excludeQuery = ['page' , 'sort' , 'search' , 'select']
        let filterQuery = {...this.queryString}
        excludeQuery.forEach((el) => delete filterQuery[el])
        filterQuery = JSON.parse(JSON.stringify(filterQuery) .replace(/(gte|gt|lte|lt|eq)/, match => `$${match}`))
        this.mongooseQuery.find({}).skip(skip).limit(limit)
        return this
    }
    sort(){
        if(this.queryString.sort){
            this.mongooseQuery.sort(this.queryString.sort).replaceAll("," , " ")
        }
    }
    select(){
        if(this.queryString.select){
            this.mongooseQuery.select(this.queryString.select).replaceAll("," , " ")
        }
    }
    search(){
        if(this.queryString.search){
            this.mongooseQuery.find({
                $or:[{title:{$regex:this.queryString.search , $options:"i"}} , {description:{$regex:this.queryString.search , $options:"i"}}]})
        }
    }

}