const User = require('./../models/userModel');
const { promisify } = require('util');
const catchAsync = require('./../utils/catchAsync');
const jwt = require('jsonwebtoken');
const sendEmail = require('./../utils/email.js');
const AppError = require('./../utils/appError');
const crypto = require('crypto');

//生产jwt令牌的函数通过 传id 然后把令牌return
const signToken = id => {
	return jwt.sign({ id }, process.env.JWT_SECRECT, { expiresIn: process.env.JWT_EXPIRES_IN });
};

//create jwt token
const createSendToken = (user, statusCode, res) => {
	const token = signToken(user._id);
	const cookieOptions = {
		expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
		httpOnly: true
	};
	if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
	//发送cookie到客户端 res
	res.cookie('jwt', token, cookieOptions);
	//把密码隐藏不显示
	user.password = undefined;
	//发送到客户端
	res.status(statusCode).json({
		status: 'success',
		token,
		data: {
			user
		}
	});
};

//注册
exports.signup = catchAsync(async (req, res, next) => {

	const newUser = await User.create({
		name: req.body.name,
		email: req.body.email,
		password: req.body.password,
		passwordConfirm: req.body.passwordConfirm,
		role: req.body.role
	});
	// console.log(newUser);

	//create jwt token
	createSendToken(newUser, 201, res);
});

//登录
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
	createSendToken(user, 200, res);
});

//验证登录信息 通过JWT token
exports.protect = catchAsync(async (req, res, next) => {
	// console.log(111);
	//1) 检查验证是否登录
	let token;
	//获取token check 它是否存在
	if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {//开头是否为这个字符串
		//[Bearer xxx] 通过空格分割获得
		token = req.headers.authorization.split(' ')[1];
	} else if (req.cookies.jwt) {
		//如果没有头部信息 就从cookie里获取token
		token = req.cookies.jwt;
	}
	// console.log(token);

	if (!token) {
		//修复!token 导致的错误
		return next(new AppError('You are not logged in!Please log in to get access.', 401));
	}


	//2) 验证登录的jwt token
	const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRECT);
	console.log(decoded);

	//3) 检查用户是否还存在
	const currentUser = await User.findById(decoded.id);
	if (!currentUser) {
		return next(new AppError('The user belonging to this token does no longer exist.', 401));
	}

	//4) Check user changed password after the token was issued
	if (currentUser.changedPasswordAfter(decoded.iat)) {
		return next(new AppError('User recently changed password!Please log in again!', 401));
	}

	req.user = currentUser;
	next();
});

//判断用户权限
exports.restrictTo = (...roles) => {
	return (req, res, next) => {
		//判断设置的权限 和 用户所有的权限是否一直
		if (!roles.includes(req.user.role)) {
			//不一致就提示错误
			return next(new AppError('You do not have permission to perform this action', 401));
		}
		//一致就放行
		next();
	};
};

//忘记密码的验证
exports.forgotPassword = catchAsync(async (req, res, next) => {
	//获取用户的邮箱
	const user = await User.findOne({ email: req.body.email });
	if (!user) {
		return next(new AppError('There is no user with email address!', 404));
	}
	//获取随机的reset token
	const resetToken = user.createPasswordResetToken();
	//保存到数据库中 加密了的token保存到数据库
	await user.save({ validateBeforeSave: false });
	//发送邮件 把未加密的token发送到客户端
	const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;//整合个充值密码的url
	//  http://localhost:3000/api/v1/users/resetPassword/68f33affc4747b44df7e0aaf5e1715918ffd8592d4be288205d7bd42a46dc61f.
	const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;
	try {
		//调用发送邮件的中间件
		await sendEmail({
			email: user.email,//当前用户的邮箱
			subject: 'You password reset token (valid 10 min)',
			message//提示信息 和 集合了token的url
		});
		res.status(200).json({
			status: 'success',
			message: 'Token send to email!'
		});
	} catch (err) {
		//如果出现错误就把 标记清空
		user.passwordResetToken = undefined;
		user.passwordResetExpires = undefined;
		//然后保存
		await user.save();
		//返回个错误提示
		return next(new AppError('There was an error sending the email!Try again later!', 500));
	}
});

//重置密码
exports.resetPassword = catchAsync(async (req, res, next) => {
	//获取链接中的未加密token 进行加密
	const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
	console.log(hashedToken);
	//去数据库里查找用户通过hashedToken
	const user = await User.findOne({ passwordResetToken: hashedToken, passwordResetExpires: { $gt: Date.now() } });
	//如果有用户且token有效性没有过期
	if (!user) {
		//没有用户说明token无效 或者过期了
		return next(new AppError('Token is invalid or expires!', 400));
	}
	//接收用户传过来的数据
	user.password = req.body.password;
	user.passwordConfirm = req.body.passwordConfirm;

	//token 和 有效期进行重置
	user.passwordResetToken = undefined;
	user.passwordResetExpires = undefined;
	//保存数据到数据库中
	await user.save();
	//添加修改时间的标记passwordChangeAt 通过userModel里面的
	//userSchema.pre('save')
	//保存成功后 登录用户 发送JWT
	createSendToken(user, 200, res);
});

//更新用户密码
exports.updatePassword = catchAsync(async (req, res, next) => {
	//获取用户信息req.user.id 通过用户id查找数据库里用户的信息是否存在
	const user = await User.findById(req.user.id).select('+password');
	//验证用户密码是否正确
	if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
		return next(new AppError('Your current password is wrong!', 401));
	}
	//更新用户的密码
	user.password = req.body.password;
	user.passwordConfirm = req.body.passwordConfirm;

	//保存用户信息
	await user.save();

	////保存成功后 登录用户 发送JWT
	createSendToken(user, 200, res);
});

