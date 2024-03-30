// This file contains the functions to render the views of the website
const Tour = require('../models/tourModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

// This function renders the overview page
exports.getOverview =catchAsync( async (req, res) => {
	const tours = await Tour.find();
	res.status(200).render('overview', {
		title: 'Overview',
		tours
	});
});

// This function renders the tour page
exports.getTour = catchAsync( async (req, res,next) => {
	console.log(req.params.slug);
	// Find the tour by slug
	const tour = await Tour.findOne({slug: req.params.slug}).populate({
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

exports.getLoginFrom = catchAsync( async (req, res) => {
	res.status(200).render('login', {
		title: 'Login your account!'
	});
});

exports.getAccount = catchAsync( async (req, res) => {
	res.status(200).render('account', {
		title: 'Your account'
	});
});