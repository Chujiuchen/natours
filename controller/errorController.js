//自定义的错误处理中间键
const AppError = require('./../utils/appError');

const handleCaseErrorDB = err => {
	const message = `Invalid ${err.path}: ${err.value}...`;
	return new AppError(message, 400);
};

const handleDuplicateFieldDB = err => {
	const value = err.errmsg.match(/"(.*?)"/g)[0];
	const message = `Duplicate field value ${value}: Please use another value!`;
	return new AppError(message, 400);
};

const handleValidationErrorDB = err => {
	const errors = Object.values(err.errors).map(el => el.message);
	const message = `Invalid input data. ${errors.join('. ')}`;
	return new AppError(message, 400);
};

//jwt token 错误的处理中间件
const handleJWTError = () => new AppError('Invalid token. Please log in again!', 401);

//jwt 过期 错误处理
const handleJWTExpiredError = () => new AppError('Your token has expired. Please log in again!', 401);

const sendErrorDev = (err, req, res) => {
	//开发环境下的错误显示
	//api接口的错误处理
	if (req.originalUrl.startsWith('/api')) {
		return res.status(err.statusCode).json({
			status: err.status,
			error: err,
			message: err.message,
			stack: err.stack
		});
	}
	//页面的错误处理 渲染一个错误页面
	console.error('Error:🎆 ', err);
	return res.status(err.statusCode).render('error', {
		title: 'Something went wrong',
		message: err.message
	});
};
//标准的错误处理
const sendErrorProd = (err, req, res) => {
	//api接口的错误处理
	if (req.originalUrl.startsWith('/api')) {
		//生产环境下的错误显示
		if (err.isOperational) {
			return res.status(err.statusCode).json({
				status: err.status,
				message: err.message
			});
		}
		console.error('Error:🎆 ', err);
		return res.status(500).json({
			status: 'error',
			message: 'Something was wrong!'
		});
	}
	//页面的错误处理 渲染一个错误页面
	if (err.isOperational) {
		return res.status(err.statusCode).render('error', {
			title: 'Something went wrong',
			message: err.message
		});
	}
	console.error('Error:🎆 ', err);
	return res.status(err.statusCode).render('error', {
		title: 'Something went wrong',
		message: 'Please try again later'
	});
};

module.exports = (err, req, res, next) => {
	err.statusCode = err.statusCode || 500;
	err.status = err.status || 'error';
	// console.log(process.env.NODE_ENV);
	// console.log(process.env.NODE_ENV === 'development');

	if (process.env.NODE_ENV === 'development') {
		sendErrorDev(err, req, res);
	} else if (process.env.NODE_ENV === 'production') {
		// console.log(process.env.NODE_ENV);
		let error = err;
		// console.log(err.statusCode)
		// console.log(error.name);
		// console.log(111)
		if (error.name === 'CastError') {
			error = handleCaseErrorDB(error);
		}
		if (error.code === 11000) {
			error = handleDuplicateFieldDB(error);
		}
		if (error.name === 'ValidationError') {
			error = handleValidationErrorDB(error);
		}
		if (error.name === 'JsonWebTokenError') {
			error = handleJWTError();
		}
		if (error.name === 'TokenExpiredError') {
			error = handleJWTExpiredError();
		}
		sendErrorProd(error, req, res);
	}
};