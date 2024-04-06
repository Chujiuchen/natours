const multer = require('multer');
const sharp = require('sharp');
const Tour = require('./../models/tourModel');
// const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
// const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');
const AppError = require('../utils/appError');


const multerStorage = multer.memoryStorage();

// 设置 multer 文件过滤器，检查文件类型是否为图像
const multerFilter = (req, file, cb) => {
	if (file.mimetype.startsWith('image')) {
		cb(null, true); // 符合条件，允许上传
	} else {
		cb(new AppError('Please upload an image file', 400), false); // 不符合条件，返回错误信息
	}
};

// 创建 upload 对象，应用存储配置和文件过滤器
const upload = multer({
	storage: multerStorage,
	fileFilter: multerFilter
});

exports.uploadTourImages = upload.fields([
	//限制上传图片的数量 imageCover为1  images为3
	{ name: 'imageCover', maxCount: 1 },
	{ name: 'images', maxCount: 3 }
]);

exports.resizeTourImages = catchAsync(async (req, res, next) => {
	// console.log(req.files);
	// 如果没有上传封面图片和其他图片，则直接执行下一个中间件
	if (!req.files.imageCover && !req.files.images) {
		return next();
	}
	// 处理Cover图片
	// 设置封面图片文件名并调整尺寸、格式和质量后保存
	req.body.imageCover = `tour-${req.params.id}-${Date.now()}-cover.jpeg`;
	await sharp(req.files.imageCover[0].buffer)
		.resize(2000, 1333)
		.toFormat('jpeg')
		.jpeg({ quality: 90 })
		.toFile(`public/img/tours/${req.body.imageCover}`);

	// 处理其他图片
	// 遍历处理每张其他图片，设置文件名并调整尺寸、格式和质量后保存，然后将文件名添加至req.body.images数组
	req.body.images = [];
	await Promise.all(req.files.images.map(async (file, i) => {
		const filename = `tour-${req.params.id}-${Date.now()}-${i + 1}.jpeg`;
		await sharp(file.buffer)
			.resize(2000, 1333)
			.toFormat('jpeg')
			.jpeg({ quality: 90 })
			.toFile(`public/img/tours/${filename}`);
		req.body.images.push(filename);
	}));
	next();
});


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
