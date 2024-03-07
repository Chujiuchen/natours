// const fs = require('fs');
// const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));
const Tour = require('./../models/tourModel');

// exports.checkId = (req, res, next, val) => {
// 	console.log(`Tour id is ${val}`);
// 	if (req.params.id * 1 > tours.length - 1) {
// 		return res.status(404).json({
// 			status: 'fail',
// 			message: 'Invalid ID'
// 		});
// 	}
// 	next();
// };

// exports.checkBody = (req, res, next) => {
// 	if (!req.body.name || !req.body.price) {
// 		return res.status(400).json({
// 			status: 'fail',
// 			message: 'Missing tour name or price!'
// 		});
// 	}
// 	next();
// };

exports.getAllTours = (req, res) => {
	res.status(200).json({
		status: 'success',
		result: tours.length,
		data: {
			tours
		}
	});
};

exports.getTour = (req, res) => {
	const tour = tours.find(el => el.id === req.params.id * 1);
	res.status(200).json({
		status: 'success',
		data: {
			tour
		}
	});
};

exports.createTour = async (req, res) => {
	try {
		const newTour = await Tour.create(req.body);
		console.log(newTour);
		res.status(201).json({
			status: 'success',
			data: {
				tour: newTour
			}
		});
	} catch (err) {
		res.status(400).json({
			status: 'fail',
			message: 'Invalid data send!'
		});
	}
};

exports.deleteTour = (req, res) => {
	res.status(204).json({
		status: 'success',
		data: null
	});
};

exports.updateTour = (req, res) => {
	res.status(200).json({
		status: 'success',
		data: {
			tour: '<Update tour>'
		}
	});
};

