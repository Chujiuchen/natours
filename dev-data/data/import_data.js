const dotenv = require('dotenv');
dotenv.config({ path: 'config.env' });
const mongoose = require('mongoose');
const fs = require('fs');
const Tour = require('./../../models/tourModel');

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8'));
// console.log(tours);

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
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

const importData = async () => {
	try {
		await Tour.create(tours);
		console.log('Data successfully loaded!');
	} catch (err) {
		console.log(err);
	}
};

const deleteData = async () => {
	try {
		await Tour.deleteMany();
		console.log('Data successfully deleted!');
	} catch (err) {
		console.log(err);
	}
};
if (process.argv[2] === '--import') {
	importData();
} else if (process.argv[2] === '--delete') {
	deleteData();
}

console.log(process.argv);



