const mongoose = require('mongoose');
const slugify = require('slugify');
const tourSchema = mongoose.Schema({
		name: {
			type: String,
			required: [true, 'A tour must hava a name!'],
			unique: true
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
			required: [true, 'A tour must have difficulty!']
		},
		ratingsAverage: {
			type: Number,
			default: 4.5
		},
		ratingsQuantity: {
			type: Number,
			default: 0
		},
		price: {
			type: Number,
			required: [true, 'A tour must have a price!']
		},
		priceDiscount: Number,
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
		startDates: [Date]
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
	this.pipeline().unshift({ $match: { secretTour: { $ne: true } }});
	next();
})

// tourSchema.pre('save', function(next) {
// 	console.log('Will save document...')
// 	next();
// });
// tourSchema.post('save',function(doc,next) {
// 	// console.log(doc);
// 	next();
// })

	const Tour = mongoose.model('Tour', tourSchema);

	module.exports = Tour;;