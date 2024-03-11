const User = require('./../models/userModel');
const { promisify } = require('util');
const catchAsync = require('./../utils/catchAsync');
const jwt = require('jsonwebtoken');
const AppError = require('./../utils/appError');

//生产jwt令牌的函数通过 传id 然后把令牌return
const signToken = id => {
	return jwt.sign({ id }, process.env.JWT_SECRECT, { expiresIn: process.env.JWT_EXPIRES_IN });
};

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
		return next(new AppError('Please provide email or password!', 400));
	}

	//数据库里检查是否正确
	const user = await User.findOne({ email }).select('+password');
	const up = await user.correctPassword(password, user.password);//调用自己创建的函数进行比较 用户密码和数据库里查出来的密码 返回 boolean
	// console.log(up);
	if (!user || !up) {
		return next(new AppError('Incorrect email or password', 401));
	}

	//返回登录信息 发送token 到客户端
	// console.log(user._id);
	const token = signToken(user._id);
	res.status(200).json({
		status: 'success',
		token
	});
});

exports.protect = catchAsync(async (req, res, next) => {
	//1) 检查验证是否登录
	let token;
	//获取token check 它是否存在
	if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {//开头是否为这个字符串
		//[Bearer xxx] 通过空格分割获得
		token = req.headers.authorization.split(' ')[1];
	}
	// console.log(token);
	if (!token) {
		return new AppError('You are not logged in!Please log in to get access.', 401);
	}
// console.log(111)

	//2) 验证登录的jwt token
	const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRECT);
	console.log(decoded);

	//3) 检查用户是否还存在
	const currentUser = await User.findById(decoded.id);
	if (!currentUser){
		return next(new AppError('The user belonging to this token does no longer exist.',401))
	}

	//4) Check user changed password after the token was issued
	if (currentUser.changedPasswordAfter(decoded.iat)){
		return next(new AppError('User recently changed password!Please log in again!',401));
	}

	req.user = currentUser;
	next();
});

