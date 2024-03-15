//创建工厂函数 deleteOne updateOne createOne这样每个功能都能调用这个函数
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
// const Tour = require('../models/tourModel');
const APIFeatures = require('../utils/apiFeatures');
//工厂封装删除函数
exports.deleteOne = Model => catchAsync(async (req, res, next) => {
	const doc = await Model.findByIdAndDelete(req.params.id);
	if (!doc) {
		return next(new AppError(`No ${doc.modelName} found with this id!`, 404));
	}
	res.status(204).json({
		status: 'success',
		data: null
	});
});
//工厂封装更新函数
exports.updateOne = Model => catchAsync(async (req, res, next) => {
	const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true
	});
	if (!doc) {
		return next(new AppError(`No ${doc.modelName} found with this id!`, 404));
	}
	res.status(200).json({
		status: 'success',
		data: {
			data: doc
		}
	});
});

//工厂封装创建函数
exports.createOne = Model => catchAsync(async (req, res, next) => {
	const doc = await Model.create(req.body);
	// console.log(doc);
	res.status(201).json({
		status: 'success',
		data: {
			data: doc
		}
	});
});

//工厂封装获取函数 因为tour 有个地方需要populate='reviews' 所以单独写了一个函数
exports.getOne = (Model, popOptions) => catchAsync(async (req, res, next) => {
	let query = Model.findById(req.params.id);
	if (popOptions) {
		query = query.populate(popOptions);
	}
	const doc = await query;
	if ((doc === null)) {
		return next(new AppError(`No document found with this id!`, 404));
	}
	res.status(200).json({
		status: 'success',
		data: {
			data: doc
		}
	});
});

//获取所有数据
exports.getAll = (Model) => catchAsync(async (req, res, next) => {
	let filter = {};
	//检查是否有tourId 如果有就添加到filter查询条件中
	if (req.params.tourId) {
		filter = { tour: req.params.tourId };
	}
	// 创建一个APIFeatures对象，该对象包含对Model.find(filter)进行过滤、排序、筛选字段和分页操作的方法
	const features = new APIFeatures(Model.find(filter), req.query).filter().sort().limitFields().pagination();

	const tours = await features.query;
	//send response
	res.status(200).json({
		status: 'success',
		result: tours.length,
		data: {
			tours
		}
	});
});