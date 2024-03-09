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
	// res.status(404).json({
	// 	status:'fail',
	// 	message:`Can not fond ${req.originalUrl} on this server!}`
	// })
	const err = new Error(`Can not fond ${req.originalUrl} on this server!}`)
	err.status = 'fail';
	err.statusCode = 404;
	console.log(1)
	next(err);
});

app.use((err,req,res,next)=>{
	err.statusCode = err.statusCode || 500;
	err.status = err.status ||'error';
	console.log(2)
	res.status(err.statusCode).json({
		status:err.status,
		message:err.message
	})
})

module.exports = app;