class APIFeatures{
	constructor(query,queryString){
		this.query = query;
		this.queryString = queryString;
	}
	filter(){
		const queryObj = { ...this.queryString };
		// console.log(queryObj)
		const excludedFields = ['page', 'sort', 'limit', 'fields'];
		excludedFields.forEach(el => delete queryObj[el]);
		let queryStr = JSON.stringify(queryObj);
		queryStr = JSON.parse(queryStr.replace(/\b(gte|gt|lt|lte)\b/g, match => `$${match}`));
		// console.log(queryStr)
		this.query.find(queryStr);
		return this;
	}
	sort(){
		if (this.queryString.sort) {
			const sortBy = this.queryString.sort.split(',').join(' ');
			this.query = this.query.sort(sortBy);
		} else {
			this.query = this.query.sort('-createAt');
		}
		// console.log(this.queryString);
		return this;
	}
	limitFields(){
		if (this.queryString.fields) {
			const fields = this.queryString.fields.split(',').join(' ');
			this.query = this.query.select(fields);
		} else {
			this.query = this.query.select('-__v');
		}
		return this;
	}
	pagination(){
		let page = this.queryString.page * 1 || 1;//page 多少页
		const limit = this.queryString.limit * 1 || 100;//limit 限制显示多少
		// const countDocuments = await Tour.countDocuments();//获取最大数据
		// const maxPages = Math.ceil(countDocuments / limit);
		// if (page > maxPages) {
		// 	page = maxPages;
		// }
		const skip = (page - 1) * limit;
		this.query = this.query.skip(skip).limit(limit);
		return this;
	}
}

module.exports = APIFeatures;