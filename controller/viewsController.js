// This file contains the functions to render the views of the website
const Tour = require('../models/tourModel');
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
exports.getTour = catchAsync( async (req, res) => {
	// Find the tour by slug
	const tour = await Tour.findOne({slug: req.params.slug}).populate({
		path: 'reviews',
		fields: 'reviews rating user'
	});
	//Build template data

	//Render the tour page with the tour data
	res.status(200).render('tour', {
		title: 'The Forest Hiker',
		tour
	});
});