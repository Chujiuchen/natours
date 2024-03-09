//自定义的错误处理中间键
const sendErrorDev = (err, res) => {
	res.status(err.statusCode).json({
		status: err.status,
		error: err,
		message: err.message,
		stack: err.stack
	});
};

const sendErrorProd = (err, res) => {
	if (err.isOperational) {
		res.status(err.statusCode).json({
			status: err.status,
			message: err.message
		});
	} else {
		console.error('Error:');
		res.status(500).json({
			status: 'error',
			message: 'Something was wrong!'
		});
	}

};

module.exports = (err, req, res, next) => {
	err.statusCode = err.statusCode || 500;
	err.status = err.status || 'error';
	console.log(process.env.NODE_ENV);
	console.log(process.env.NODE_ENV === 'development');
	if (process.env.NODE_ENV === 'development') {
		sendErrorDev(err, res);
	} else if (process.env.NODE_ENV === 'production') {
		// console.log(process.env.NODE_ENV);
		sendErrorProd(err, res);
	}

};