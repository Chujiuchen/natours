const mongoose = require('mongoose');
//创建评价Model 每个旅游都需要有评论 每个评论都需要有用户
const reviewSchema = new mongoose.Schema(
	{
		review: {
			type: String,
			require: [true, 'Review can not be empty!']
		},
		rating: {
			type: Number,
			min: 1,
			max: 5
		},
		createAt: {
			type: Date,
			default: Date.now()
		},
		tour: {
			type: mongoose.Schema.ObjectId,
			ref: 'Tour',
			require: [true, 'Review must belong to tour.']
		},
		user: {
			type: mongoose.Schema.ObjectId,
			ref: 'User',
			require: [true, 'Review must belong to a user.']
		}

	}, {
		toJSON: { virtuals: true },
		toObject: { virtuals: true }
	}
);

reviewSchema.pre(/^find/, function(next) {
	//每次查询前执行 把user数据加进tour中对应的user._id
	this.populate({
		path: 'user',
		select: 'name'
	}).populate({
		path:'tour',
		select:'name photo'
	});
	next();
});


const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;