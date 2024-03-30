// This file contains the functions to render the views of the website
const Tour = require('../models/tourModel');
const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

// This function renders the overview page
exports.getOverview = catchAsync(async (req, res) => {
	const tours = await Tour.find();
	res.status(200).render('overview', {
		title: 'Overview',
		tours
	});
});

// This function renders the tour page
exports.getTour = catchAsync(async (req, res, next) => {
	console.log(req.params.slug);
	// Find the tour by slug
	const tour = await Tour.findOne({ slug: req.params.slug }).populate({
		path: 'reviews',
		fields: 'reviews rating user'
	});
	console.log(tour);
	//Build template data
	if (!tour) {
		return next(new AppError('No tour found with that slug', 404));
	}
	//Render the tour page with the tour data
	res.status(200).render('tour', {
		title: `${tour.name} Tour`,
		tour
	});
});

exports.getLoginFrom = catchAsync(async (req, res) => {
	res.status(200).render('login', {
		title: 'Login your account!'
	});
});

exports.getAccount = catchAsync(async (req, res) => {
	res.status(200).render('account', {
		title: 'Your account'
	});
});

exports.updateUserData = catchAsync(async (req, res, next) => {
	const updatedUser = await User.findByIdAndUpdate(
		req.user.id,
		{
			name: req.body.name,
			email: req.body.email
		}, {
			new: true,//return the updated user
			runValidators: true//运行更新验证器时执行验证
		});
	//更新数据后重定向到个人账户页面把新用户数据渲染到页面上
	res.status(200).render('account', {
		title: 'Your account',
		user: updatedUser
	});
});