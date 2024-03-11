//自定义的错误处理中间键
const AppError = require('./../utils/appError')

const handleCaseErrorDB = err =>{
	const message = `Invalid ${err.path}: ${err.value}...`
	return new AppError(message,400);
}

const handleDuplicateFieldDB = err =>{
	const value = err.errmsg.match(/"(.*?)"/g)[0];
	const message = `Duplicate field value ${value}: Please use another value!`
	return new AppError(message,400);
}

const handleValidationErrorDB = err =>{
	const errors = Object.values(err.errors).map(el =>el.message);

	const message  = `Invalid input data. ${errors.join('. ')}`;
	return new AppError(message,400);
}

const sendErrorDev = (err, res) => {
	//开发环境下的错误显示
	res.status(err.statusCode).json({
		status: err.status,
		error: err,
		message: err.message,
		stack: err.stack
	});
};

const sendErrorProd = (err, res) => {
	//生产环境下的错误显示
	if (err.isOperational) {
		res.status(err.statusCode).json({
			status: err.status,
			message: err.message
		});
	} else {
		console.error('Error:',err);
		res.status(500).json({
			status: 'error',
			message: 'Something was wrong!'
		});
	}

};

module.exports = (err, req, res, next) => {
	err.statusCode = err.statusCode || 500;
	err.status = err.status || 'error';
	// console.log(process.env.NODE_ENV);
	// console.log(process.env.NODE_ENV === 'development');

	if (process.env.NODE_ENV === 'development') {
		sendErrorDev(err, res);
	} else if (process.env.NODE_ENV === 'production') {
		// console.log(process.env.NODE_ENV);
		let error = err;
		// console.log(err.statusCode)
		// console.log(error.name);
		// console.log(111)
		if(error.name === 'CastError'){
			error = handleCaseErrorDB(error);
		}
		if(error.code === 11000){
			error = handleDuplicateFieldDB(error);
		}
		if (error.name === 'ValidationError'){
			error = handleValidationErrorDB(error);
		}

		sendErrorProd(error, res);
	}

};