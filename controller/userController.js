const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('./../utils/catchAsync');


const filterObj = (obj, ...allowedFields) => {
	const newObj = {};
	Object.keys(obj).forEach(el => {
		if (allowedFields.includes(el)) {
			newObj[el] = obj[el];
		}
	});
	return newObj;
};

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
		status:'success',
		data:{
			user:updateUser
		}
	})
});


exports.getAllUsers = (req, res) => {
	res.status(500).json({
		status: 'error',
		message: 'This route is not build'
	});
};
exports.getUser = catchAsync(async (req, res, next) => {
	const user = await User.findById(req.params.id);
	if (!user) {
		return next(new AppError('No tour found with this id!', 404));
	}
	res.status(200).json({
		status: 'success',
		data: {
			user
		}
	});
});
exports.createUser = (req, res) => {
	res.status(500).json({
		status: 'error',
		message: 'This route is not build'
	});
};
exports.updateUser = (req, res) => {
	res.status(500).json({
		status: 'error',
		message: 'This route is not build'
	});
};
exports.deleteUser = (req, res) => {
	res.status(500).json({
		status: 'error',
		message: 'This route is not build'
	});
};