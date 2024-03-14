//创建工厂函数 deleteOne 这样每个功能都能调用这个函数
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

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