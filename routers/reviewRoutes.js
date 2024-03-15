//创建review的路径
const express = require('express');
const reviewController = require('./../controller/reviewController');
const authController = require('./../controller/authController');

//mergeParams:true 合并来自父路由的参数
const router = express.Router({ mergeParams: true });

router.use(authController.protect);
// 路由处理根路径的请求
router.route('/')
	// 处理 GET 请求，调用 reviewController 的 getAllReviews 方法
	.get(reviewController.getAllReviews)
	// 处理 POST 请求，先调用 authController 的 protect 方法进行身份验证，然后调用 authController 的 restrictTo 方法限制权限为'user'，最后调用 reviewController 的 createReview 方法创建评论
	.post(authController.restrictTo('user'), reviewController.setTourAndUserId, reviewController.createReview);

//创建删除review路由
router.route('/:id')
	.get(reviewController.getReview)
	.patch(authController.restrictTo('user', 'admin'), reviewController.updateReview)
	.delete(authController.restrictTo('user', 'admin'), reviewController.deleteReview);

module.exports = router;