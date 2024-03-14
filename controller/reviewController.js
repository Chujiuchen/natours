//创建review控制器
const Review = require('./../models/reviewModel');
const catchAsync = require('./../utils/catchAsync');

//获取所有review
exports.getAllReviews = catchAsync(async (req, res, next) => {
	const reviews = await Review.find();
	res.status(200).json({
		status: 'success',
		result: reviews.length,
		data: {
			reviews
		}
	});
});

//创建review
exports.createReview = catchAsync(async (req, res, next) => {
	const newReview = await Review.create(req.body);
	res.status(201).json({
		status: 'success',
		data: {
			review: newReview
		}
	});
});