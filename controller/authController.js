const user = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const jwt = require('jsonwebtoken');

exports.signup = catchAsync(async (req, res, next) => {
	const newUser = await user.create({
		name: req.body.name,
		email: req.body.email,
		password: req.body.password,
		passwordConfirm: req.body.passwordConfirm
	});
	// console.log(newUser);

	//create jwt token
	const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRECT, { expiresIn: process.env.JWT_EXPIRES_IN });

	//发送到客户端
	res.status(201).json({
		status: 'success',
		token,
		data: {
			tour: newUser
		}
	});
});
