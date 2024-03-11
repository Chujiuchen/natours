const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('./../utils/catchAsync');

exports.getAllUsers = (req, res) => {
	res.status(500).json({
		status: 'error',
		message: 'This route is not build'
	});
};
exports.getUser =catchAsync (async (req, res,next) => {
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