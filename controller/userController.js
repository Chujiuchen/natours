const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./handlerFactory');


const filterObj = (obj, ...allowedFields) => {
	const newObj = {};
	Object.keys(obj).forEach(el => {
		if (allowedFields.includes(el)) {
			newObj[el] = obj[el];
		}
	});
	return newObj;
};

//获取当前用户id
exports.getMe = catchAsync(async (req, res, next) => {
	req.params.id = req.user.id;
	next();
});

//更新用户的信息
exports.updataMe = catchAsync(async (req, res, next) => {
	// console.log(111)
	//安全判断 如果包含密码直接弹个错误
	if (req.body.password || req.body.passwordConfirm) {
		return next(new AppError('This route is not for password update.Please use /updateMyPassword', 400));
	}

	//验证只允许更新的字段
	const filteredBody = filterObj(req.body, 'name', 'email');
	// console.log(filteredBody);
	//更新用户数据 避免创建的验证信息 用findByIdAndUpdate(id,运行更新的字段,设置)
	const updateUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
		new: true,
		runValidators: true
	});

	res.status(200).json({
		status: 'success',
		data: {
			user: updateUser
		}
	});
});

//删除用户把活跃标记为false  不进行如何数据删除 只把数据标记为非活跃用户
exports.deleteMe = catchAsync(async (req, res, next) => {
	await User.findByIdAndUpdate(req.user.id, { active: false });
	res.status(204).json({
		status: 'success',
		data: null
	});
});

//获取所有用户数据
exports.getAllUsers = factory.getAll(User);
//调用工厂函数 获取单个用户数据
exports.getUser = factory.getOne(User);
//调用工厂的创建函数
exports.createUser = factory.createOne(User);
//调用工厂的更新函数
exports.updateUser = factory.updateOne(User);
//调用工厂的删除函数
exports.deleteUser = factory.deleteOne(User);