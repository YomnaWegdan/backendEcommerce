export class ApiFeatures {
    constructor(mongooseQuery, queryString) {
        this.mongooseQuery = mongooseQuery;
        this.queryString = queryString;
    }  

    pagination() {
        const page = parseInt(this.queryString.page, 10) || 1;
        const limit = 2;
        const skip = (page - 1) * limit;

        this.mongooseQuery.skip(skip).limit(limit);
        this.page = page;
        return this;
    }

    filter() {
        const excludeQuery = ['page', 'sort', 'search', 'select'];
        let filterQuery = { ...this.queryString };
        excludeQuery.forEach(el => delete filterQuery[el]);

        // Convert query parameters to MongoDB operators
        filterQuery = JSON.parse(JSON.stringify(filterQuery)
            .replace(/\b(gte|gt|lte|lt|eq)\b/g, match => `$${match}`));

        this.mongooseQuery.find(filterQuery);
        return this;
    }

    sort() {
        if (this.queryString.sort) {
            const sortBy = this.queryString.sort.replace(/,/g, ' ');
            this.mongooseQuery.sort(sortBy);
        }
        return this;
    }

    select() {
        if (this.queryString.select) {
            const fields = this.queryString.select.replace(/,/g, ' ');
            this.mongooseQuery.select(fields);
        }
        return this;
    }

    search() {
        if (this.queryString.search) {
            const searchRegex = new RegExp(this.queryString.search, 'i');
            this.mongooseQuery.find({
                $or: [
                    { title: { $regex: searchRegex } },
                    { description: { $regex: searchRegex } }
                ]
            });
        }
        return this;
    }
}
