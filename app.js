const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controller/errorController');
const tourRouter = require('./routers/tourRoutes');
const userRouter = require('./routers/userRoutes');

const app = express();

//set security HTTP headers
app.use(helmet());

//限制同ip访问api的次数
const limiter = rateLimit({
	max: 100,
	windowMs: 60 * 60 * 100,
	message: 'Too many requests form this ip.Please try again in an hour!'
});
app.use('/api', limiter);

if (process.env.NODE_ENV === 'development') {
	app.use(morgan('dev'));
}

app.use(express.json({
	limit: '10kb'
}));
//express能读取到public文件中的所有文件
app.use(express.static(`${__dirname}/public`));

//两个url
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

//不是指定的路由 就提示404
app.all('*', (req, res, next) => {
	const err = new AppError(`Can not fond ${req.originalUrl} on this server!}`, 404);
	next(err);
});

app.use(globalErrorHandler);

module.exports = app;