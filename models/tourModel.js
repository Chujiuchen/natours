const mongoose = require('mongoose');
const slugify = require('slugify');
// const User = require('./../models/userModel');

const tourSchema = mongoose.Schema({
		name: {
			type: String,
			required: [true, 'A tour must hava a name!'],//不为空
			unique: true,
			trim: true,
			maxlength: [40, 'A tour name must have less or equal then 40 characters'],//最大长度
			minlength: [6, 'A tour name must have more or equal then 10 characters']//最小长度
		},
		slug: String,
		duration: {
			type: Number,
			required: [true, 'A tour must have duration!']
		},
		maxGroupSize: {
			type: Number,
			required: [true, 'A tour must have group size!']
		},
		difficulty: {
			type: String,
			required: [true, 'A tour must have difficulty!'],
			enum: {
				values: ['easy', 'medium', 'difficult'],//枚举限制
				message: 'Difficulty is either:easy,medium,difficult!'//err信息显示
			}
		},
		ratingsAverage: {
			type: Number,
			default: 4.5,//默认值
			min: [1, 'Rating must be above 1.0!'],//最大值
			max: [5, 'Rating must be below 5.0!']//最小值
		},
		ratingsQuantity: {
			type: Number,
			default: 0
		},
		price: {
			type: Number,
			required: [true, 'A tour must have a price!']
		},
		priceDiscount: {
			type: Number,
			validate: {
				validator: function(val) {
					//this 只能指向新创建的Tour 所以updata数据不能生效这个验证规则
					return val < this.price;
				},
				message: 'Discount price {VALUE} should be below regular price!'
			}
		},
		secretTour: {
			type: Boolean,
			default: false
		},
		summary: {
			type: String,
			trim: true
		},
		description: {
			type: String,
			trim: true
		},
		imageCover: {
			type: String,
			required: [true, 'A tour must have a img!']
		},
		images: [String],
		createAt: {
			type: Date,
			default: Date.now(),
			select: false
		},
		startDates: [Date],
		startLocation: {
			type: {
				type: String,
				default: 'Point',
				enum: ['Point']
			},
			coordinates: [Number],
			address: String,
			description: String
		},
		locations: [{
			type: {
				type: String,
				default: 'Point',
				enum: ['Point']
			},
			coordinates: [Number],
			address: String,
			description: String,
			day: Number
		}],
		guides: [{
			type:mongoose.Schema.ObjectId,//mongoDB 的id类型
			ref:'User'//指向那个表
		}]
	}, {
		toJSON: { virtuals: true },
		toObject: { virtuals: true }
	}
);

tourSchema.virtual('durationWeeks').get(function() {
	return this.duration / 7;
});

//获取到slug和name属性 然后赋值
tourSchema.pre('save', function(next) {
	this.slug = slugify(this.name, { lower: true });
	next();
});
//获取到每个旅游 对应的每个导游的信息、
// tourSchema.pre('save',async function(next) {
// 	const guidesPromise = this.guides.map(async id =>await User.findById(id));
// 	this.guides =await Promise.all(guidesPromise);
// 	next();
// });


//查询前限制 secretTour = true 的全部不显示  等同于vip内容
tourSchema.pre(/^find/, function(next) {
	this.find({ secretTour: { $ne: true } });
	this.start = Date.now();
	next();
});

tourSchema.post(/^find/, function(docs, next) {
	console.log(`Query took ${Date.now() - this.start} milliseconds`);
	next();
});

// 聚合函数查询的数据 没有提前过滤条件 这个就是在聚合函数查询前 添加一个条件到聚合函数中在进行next
tourSchema.pre('aggregate', function(next) {
	this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
	next();
});

// tourSchema.pre('save', function(next) {
// 	console.log('Will save document...')
// 	next();
// });
// tourSchema.post('save',function(doc,next) {
// 	// console.log(doc);
// 	next();
// })

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
