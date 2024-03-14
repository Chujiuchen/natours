//创建工厂函数 deleteOne updateOne createOne这样每个功能都能调用这个函数
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Tour = require('../models/tourModel');
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
	console.log(doc);
	res.status(201).json({
		status: 'success',
		data: {
			data: doc
		}
	});
});