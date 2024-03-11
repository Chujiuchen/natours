const mongoose = require('mongoose');
const validator = require('validator')
const bcrypt = require('bcryptjs')

const userSchema = mongoose.Schema({
	name: {
		type: String,
		required: [true, 'Please tell us your name!']
	},
	email: {
		type: String,
		required: [true, 'Please tell us your email!'],
		unique: true,
		lowercase:true,
		validate:[validator.isEmail,'Please provide a valid email!']
	},
	photo: String,
	password: {
		type: String,
		required: [true, 'Please provide a password!'],
		minlength:8,
		select:false
	},
	passwordConfirm: {
		type: String,
		required: [true, 'Please confirm your password!']
	}
});

userSchema.pre('save',async function(next) {
	console.log(123123)
	if (!this.isModified('password')) return next();
	//通过bcryptjs加密字符串
	this.password =await bcrypt.hash(this.password,12);
	this.passwordConfirm = undefined;
	next();
})

userSchema.methods.correctPassword = function(candidaPassword,userPassword) {
	return bcrypt.compare(candidaPassword,userPassword);
}

const User = mongoose.model('User',userSchema);
module.exports = User;