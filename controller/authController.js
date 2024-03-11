const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const jwt = require('jsonwebtoken');
const AppError = require('./../utils/appError')

const signToken = id =>{
	return jwt.sign({ id }, process.env.JWT_SECRECT, { expiresIn: process.env.JWT_EXPIRES_IN });
}

exports.signup = catchAsync(async (req, res, next) => {
	const newUser = await User.create({
		name: req.body.name,
		email: req.body.email,
		password: req.body.password,
		passwordConfirm: req.body.passwordConfirm
	});
	// console.log(newUser);

	//create jwt token
	const token = signToken(newUser._id);
		//发送到客户端
	res.status(201).json({
		status: 'success',
		token,
		data: {
			tour: newUser
		}
	});
});

exports.login = catchAsync(async (req, res, next) => {
	//获取提交的用户信息
	const { email, password } = req.body;
	// console.log(email,password);

	//检查信息是否存在
	if (!email || !password) {
		return next(new AppError('Please provide email or password!',400));
	}

	//数据库里检查是否正确
	const user =await User.findOne({email}).select('+password');
	const up =await user.correctPassword(password,user.password);
	// console.log(up);
	if (!user||!up){
		return next(new AppError('Incorrect email or password',401))
	}

	//返回登录信息 发送token 到客户端
	// console.log(user._id);
	const token = signToken(user._id);
	res.status(200).json({
		status:'success',
		token
	});
});
