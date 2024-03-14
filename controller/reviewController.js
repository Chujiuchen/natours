//创建review控制器
const Review = require('./../models/reviewModel');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./handlerFactory');

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
//设置tourId和userId
exports.setTourAndUserId = catchAsync(async (req, res, next) => {
//如果没有tour，则默认tourId为params.tourId 如果没有user，则默认userId为req.user.id
	if (!req.body.tour){
		req.body.tour = req.params.tourId;
	}
	if (!req.body.user){
		req.body.user = req.user.id;
	}
	next();
});
//调用工厂函数创建review
exports.createReview = factory.createOne(Review);
//调用工厂函数更新review
exports.updateReview = factory.updateOne(Review);
//调用工厂的删除函数
exports.deleteReview = factory.deleteOne(Review);