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