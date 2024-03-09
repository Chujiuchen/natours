const express = require('express');
const morgan = require('morgan');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controller/errorController');
const tourRouter = require('./routers/tourRoutes');
const userRouter = require('./routers/userRoutes');

const app = express();

app.use(express.json());

if (process.env.NODE_ENV === 'development') {
	app.use(morgan('dev'));
}

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