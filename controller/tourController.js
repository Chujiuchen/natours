const Tour = require('./../models/tourModel');
const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

//展示前五的旅游数据
exports.aliasTopTours = (req, res, next) => {
	req.query.limit = '5';
	req.query.sort = '-ratingsAverage,price';
	req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
	next();
};

//获取所有tours
exports.getAllTours = catchAsync(async (req, res, next) => {
	const features = new APIFeatures(Tour.find(), req.query).filter().sort().limitFields().pagination();
	const tours = await features.query;
	// console.log(11)
	//send response
	res.status(200).json({
		status: 'success',
		result: tours.length,
		data: {
			tours
		}
	});
});

//获取单独的tour
exports.getTour = catchAsync(async (req, res, next) => {
	const tour = await Tour.findById(req.params.id);
	if (!tour) {
		return next(new AppError('No tour found with this id!', 404));
	}
	res.status(200).json({
		status: 'success',
		data: {
			tour
		}
	});
});

//创建tour
exports.createTour = catchAsync(async (req, res, next) => {
	const newTour = await Tour.create(req.body);
	console.log(newTour);
	res.status(201).json({
		status: 'success',
		data: {
			tour: newTour
		}
	});
});

//删除tour
exports.deleteTour = catchAsync(async (req, res, next) => {
	const tour = await Tour.findByIdAndDelete(req.params.id);
	if (!tour) {
		return next(new AppError('No tour found with this id!', 404));
	}
	res.status(204).json({
		status: 'success',
		data: null
	});
});

//更新tour
exports.updateTour = catchAsync(async (req, res, next) => {
	const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true
	});
	if (!tour) {
		return next(new AppError('No tour found with this id!', 404));
	}
	res.status(200).json({
		status: 'success',
		data: {
			tour
		}
	});
});

//通过聚合 自定义获取旅游的所有属性
exports.getTourStats = catchAsync(async (req, res, next) => {
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
		}, {
			$sort: { minPrice: 1 }
		}
	]);
	res.status(200).json({
		status: 'success',
		data: {
			stats
		}
	});
});