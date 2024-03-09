const express = require('express');
const app = express();
const morgan = require('morgan');
const tourRouter = require('./routers/tourRoutes');
const userRouter = require('./routers/userRoutes');

app.use(express.json());

if (process.env.NODE_ENV === 'development') {
	app.use(morgan('dev'));
}

app.use(express.static(`${__dirname}/public`));

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

//不是指定的路由 就提示404
app.all('*',(req, res,next)=>{
	res.status(404).json({
		status:'fail',
		message:`Can not fond ${req.originalUrl} on this server!}`
	})
});

module.exports = app;