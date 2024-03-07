const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const app = require('./app');
const mongoose = require('mongoose');
const port = process.env.PORT;

// const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
// console.log(DB);

mongoose.connect(process.env.DATABASE_LOCAL, {
	useNewUrlParser: true,
	useCreateIndex: true,
	useFindAndModify: false,
	useUnifiedTopology:true
}).then(() => {
	// console.log(con.connection)
	console.log('Database connection successful!');
});

// console.log(process.env.PORT);

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});