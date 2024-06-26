const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const path = require('path');
const cors = require('cors');
const coookieParser = require('cookie-parser');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controller/errorController');
const tourRouter = require('./routers/tourRoutes');
const userRouter = require('./routers/userRoutes');
const reviewRouter = require('./routers/reviewRoutes');
const viewRouter = require('./routers/viewRoutes');
const bookingRouter = require('./routers/bookingRoutes');

const app = express();

app.use(cors());

//set view engine
app.set('view engine', 'pug');
//set views folder
app.set('views', path.join(__dirname, 'views'));

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
//express.json 能解析json数据并进行限制
app.use(express.json({
	limit: '10kb'
}));
//express.urlencoded 能解析表单提交的编码数据进行限制
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

app.use(coookieParser());

//NoSQL query injection 防止"email":{"$gt":""} 直接就能登录
app.use(mongoSanitize());
//XSS 这个将去除如何用户输入的html代码
app.use(xss());
//hpp 防止HTTP参数污染
app.use(hpp({
	whitelist: ['ratingsAverage', 'ratingsQuantity', 'duration', 'maxGroupSize', 'difficulty', 'price']
}));

app.use((req, res, next) => {
	req.requestTime = new Date().toISOString();
	// console.log(req.cookies)
	next();
});

//express能读取到public文件中的所有文件
app.use(express.static(path.join(__dirname, 'public')));

//4个url
app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/booking', bookingRouter);

//不是指定的路由 就提示404
app.all('*', (req, res, next) => {
	const err = new AppError(`Can not fond ${req.originalUrl} on this server!}`, 404);
	next(err);
});

app.use(globalErrorHandler);

module.exports = app;