const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const app = require('./app');
const mongoose = require('mongoose');
const port = process.env.PORT;


const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
// const DB = process.env.DATABASE_LOCAL;
// console.log(DB);

mongoose.connect(DB, {
	useNewUrlParser: true,
	useCreateIndex: true,
	useFindAndModify: false,
	useUnifiedTopology: true
}).then(() => {
	// console.log(con.connection)
	console.log('Database connection successful!');
});


// // console.log(process.env.PORT);
//
// const testTour = new Tour({
// 	name: 'Beijing',
// 	rating: 4.7,
// 	price: 3998
// });

// testTour.save().then(con => {
// 	console.log(con);
// 	console.log('Insert data success!');
// }).catch(err => {
// 	console.log('Error :', err);
// });

const server = app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});

//server 启动错误提示
process.on('unhandledRejection', err => {
	console.log(err.name, err.message);
	console.log('Unhandled Rejection: PLEASE CHECK CODE!');
	server.close(() => {
		process.exit(1);
	});
});

process.on('uncaughtException', err => {
	console.log(err.name, err.message);
	console.log('Uncaught Exception: PLEASE CHECK CODE!');
	server.close(() => {
		process.exit(1);
	});
});
