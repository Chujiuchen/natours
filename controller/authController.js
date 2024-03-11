const user = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');

exports.signup = catchAsync(async (req, res, next) => {
	const newUser = await user.create(req.body);
	// console.log(newUser);
	res.status(201).json({
		status: 'success',
		data: {
			tour: newUser
		}
	});
});
