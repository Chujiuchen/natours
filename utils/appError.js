class AppError extends Error {
	constructor(message, statusCode) {
		super(message);//传进来什么信息就是什么
		this.statusCode = statusCode;
		this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
		this.isOperational = true;//设置这个状态永远是true
		Error.captureStackTrace(this, this.constructor);
		console.log(55555555);
	}
}

module.exports = AppError;