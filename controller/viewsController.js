// This file contains the functions to render the views of the website
const tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');
// This function renders the overview page
exports.getOverview =catchAsync( async (req, res) => {
	const tours = await tour.find();
	res.status(200).render('overview', {
		title: 'Overview',
		tours
	});
});

// This function renders the tour page
exports.getTour = (req, res) => {
	res.status(200).render('overview', {
		title: 'The Forest Hiker'
	});
};