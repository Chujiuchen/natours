//创建review控制器
const Review = require('./../models/reviewModel');
const catchAsync = require('./../utils/catchAsync');

//获取所有review
exports.getAllReviews = catchAsync(async (req, res, next) => {
	let filter= {};
	//检查是否有tourId 如果有就添加到filter查询条件中
	if(req.params.tourId) {
		filter = {tour:req.params.tourId}
	}
	//如果没有就全部查询出来
	const reviews = await Review.find(filter);
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
	//如果没有tour，则默认tourId为params.tourId 如果没有user，则默认userId为req.user.id
	if (!req.body.tour){
		req.body.tour = req.params.tourId;
	}
	if (!req.body.user){
		req.body.user = req.user.id;
	}
	const newReview = await Review.create(req.body);
	res.status(201).json({
		status: 'success',
		data: {
			review: newReview
		}
	});
});