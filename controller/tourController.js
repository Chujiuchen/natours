// const fs = require('fs');
// const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));
const Tour = require('./../models/tourModel');
const APIFeatures = require('./../utils/apiFeatures');
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

exports.aliasTopTours = (req, res, next) => {
	req.query.limit = '5';
	req.query.sort = '-ratingsAverage,price';
	req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
	next();
};

exports.getAllTours = async (req, res) => {
	try {
		const features = new APIFeatures(Tour.find(), req.query).filter().sort().limitFields().pagination();
		const tours = await features.query;
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
			message: err
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

exports.getTourStats = async (req, res) => {
	try {
		const stats = await Tour.aggregate([
			{
				$match: { ratingsAverage: { $gte: 4.5 } }
			}, {
				$group: {
					_id: { $toUpper: '$difficulty' },
					numTour: { $sum: 1 },
					numRatings: { $sum: '$ratingsOuantity' },
					avgRating: { $avg: '$ratingsAverage' },
					avgPrice: { $avg: '$price' },
					minPrice: { $min: '$price' },
					maxPrice: { $max: '$price' }
				}
			},{
			$sort:{ minPrice: 1 }
			}
		]);
		res.status(200).json({
			status: 'success',
			data: {
				stats
			}
		});
	} catch (err) {
		res.status(404).json({
			status: 'fail',
			message: err
		});
	}
};