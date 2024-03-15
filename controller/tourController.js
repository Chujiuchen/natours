const Tour = require('./../models/tourModel');
// const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
// const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');

//展示前五的旅游数据
exports.aliasTopTours = (req, res, next) => {
	req.query.limit = '5';
	req.query.sort = '-ratingsAverage,price';
	req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
	next();
};

//获取所有tours
exports.getAllTours = factory.getAll(Tour);
//获取单独的tour
exports.getTour = factory.getOne(Tour, 'reviews');
////调用工厂的创建函数创建tour
exports.createTour = factory.createOne(Tour);
//调用工厂的删除函数删除tour
exports.deleteTour = factory.deleteOne(Tour);
//调用工厂的更新函数更新tour
exports.updateTour = factory.updateOne(Tour);

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


//获取定位信息 /tours-within/:distance/center/:latlng/unit/:unit
exports.getToursWithin = catchAsync(async (req, res, next) => {
	const { distance, latlng, unit } = req.params;
	const [lat, lng] = latlng.split(',');//获取经纬度
	const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1; // calculate radius in  miles or kilometers
	if (!lat || !lng) {
		//检查经纬度是否有效
		return next(new AppError('Invalid latlng', 400));
	}
	//根据经纬度和半径获取旅游数据 通过 MongoDB的地理空间查询操作符$geoWithin $centerSphere 进行查询
	const tours = await Tour.find({
		startLocation: {
			$geoWithin: {
				$centerSphere: [[lng, lat], radius]
			}
		}
	});
	res.status(200).json({
		status: 'success',
		results: tours.length,
		data: {
			tours
		}
	});
});

//获取当前定位信息距离进的旅游  /distance/:latlng/unit/:unit
exports.getDistances = catchAsync(async (req, res, next) => {
	const { latlng, unit } = req.params;
	const [lat, lng] = latlng.split(',');//获取经纬度
	const multiplier = unit === 'mi' ? 0.0006213711 : 0.001; // calculate radius in  miles or kilometers
	console.log(lat, lng, unit, multiplier);
	if (!lat || !lng) {
		//检查经纬度是否有效
		return next(new AppError('Invalid latlng', 400));
	}
	// 当前位置距离所有旅游的距离 它使用 Tour 模型上的 aggregate 函数执行地理空间查询 通过 MongoDB的地理空间查询操作符$geoNear 进行查询
	const distances = await Tour.aggregate([
		{
			$geoNear: {
				near: {
					type: 'Point',
					coordinates: [lng * 1, lat * 1]//转换为数字类型
				},
				distanceField: 'distance',
				distanceMultiplier: multiplier // convert meters to kilometers: radius,
			}
		},
		{
			$project: {
				//只返回需要的字段
				name: 1,
				distance: 1
			}
		}
	]);
	// console.log(distances);
	res.status(200).json({
		status: 'success',
		data: {
			data: distances
		}
	});
});
