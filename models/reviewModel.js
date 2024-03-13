const mongoose = require('mongoose');
//创建评价Model 每个旅游都需要有评论 每个评论都需要有用户
const reviewSchema = new mngoose.Schema(
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

	},{
		toJSON: { virtuals: true },
		toObject: { virtuals: true }
	}
);
const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;