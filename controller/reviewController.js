//创建review控制器
const Review = require('./../models/reviewModel');
const factory = require('./handlerFactory');
//const catchAsync = require('./../utils/catchAsync');

//设置tourId和userId
exports.setTourAndUserId = async (req, res, next) => {
//如果没有tour，则默认tourId为params.tourId 如果没有user，则默认userId为req.user.id
	if (!req.body.tour){
		req.body.tour = req.params.tourId;
	}
	if (!req.body.user){
		req.body.user = req.user.id;
	}
	next();
};

//获取所有review
exports.getAllReviews = factory.getAll(Review);
//调用工厂函数创建review
exports.createReview = factory.createOne(Review);
//调用工厂函数更新review
exports.updateReview = factory.updateOne(Review);
//调用工厂的删除函数
exports.deleteReview = factory.deleteOne(Review);
//调用工厂函数获取review
exports.getReview = factory.getOne(Review);