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

exports.getAllTours = async (req, res) => {
	try {
		//build query
		const queryObj = { ...req.query };
		const excludedFields = ['page', 'sort', 'limit', 'fields'];
		excludedFields.forEach(el => delete queryObj[el]);

		// console.log(queryObj);
		let queryStr = JSON.stringify(queryObj);
		queryStr = JSON.parse(queryStr.replace(/\b(gte|gt|lt|lte)\b/g, match => `$${match}`));
		// console.log((JSON.parse(queryStr)));

		let query = Tour.find(queryStr);
		//sort
		if (req.query.sort) {
			const sortBy = req.query.sort.split(',').join(' ');
			// console.log(sortBy);
			query = query.sort(sortBy);
		} else {
			query = query.sort('-createAt');
		}

		//field
		if (req.query.fields) {
			const fields = req.query.fields.split(',').join(' ');
			query = query.select(fields);
		} else {
			query = query.select('-__v');
		}

		//execute query
		const tours = await query;

		//send response
		res.status(200).json({
			status: 'success',
			result: tours.length,
			data: {
				tours
			}
		});
	} catch (err) {
		res.status(404).json({
			status: 'fail',
			message: err
		});
	}
};

exports.getTour = async (req, res) => {
	try {
		const tour = await Tour.findById(req.params.id);
		res.status(200).json({
			status: 'success',
			data: {
				tour
			}
		});
	} catch (err) {
		res.status(404).json({
			status: 'fail',
			message: err
		});
	}
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

exports.deleteTour = async (req, res) => {
	try {
		await Tour.findByIdAndDelete(req.params.id);
		res.status(204).json({
			status: 'success',
			data: null
		});
	} catch (err) {
		res.status(400).json({
			status: 'fail',
			message: err
		});
	}
};

exports.updateTour = async (req, res) => {
	try {
		const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true
		});
		res.status(200).json({
			status: 'success',
			data: {
				tour
			}
		});
	} catch (err) {
		res.status(400).json({
			status: 'fail',
			message: err
		});
	}
};

