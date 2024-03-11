const mongoose = require('mongoose');
const crypto = require('crypto');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
	name: {
		type: String,
		required: [true, 'Please tell us your name!']
	},
	email: {
		type: String,
		required: [true, 'Please tell us your email!'],
		unique: true,
		lowercase: true,
		validate: [validator.isEmail, 'Please provide a valid email!']
	},
	photo: String,
	role: {
		type: String,
		enum: ['user', 'guide', 'lead-guide', 'admin'],
		default: 'user'
	},
	password: {
		type: String,
		required: [true, 'Please provide a password!'],
		minlength: 8,
		select: false
	},
	passwordConfirm: {
		type: String,
		required: [true, 'Please confirm your password!']
	},
	passwordChangeAt: Date,
	passwordResetToken: String,
	passwordResetExpires: Date
});

userSchema.pre('save', async function(next) {
	// console.log(123123);
	if (!this.isModified('password')) return next();
	//通过bcryptjs加密字符串
	this.password = await bcrypt.hash(this.password, 12);
	this.passwordConfirm = undefined;
	next();
});

//验证密码是否正确的bcrypt函数
userSchema.methods.correctPassword = function(candidaPassword, userPassword) {
	return bcrypt.compare(candidaPassword, userPassword);
};

//判断是否有修改密码 如果有修改 passwordChangeAt参数就会有数据
userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
	if (this.passwordChangeAt) {
		const changedTimestamp = parseInt(this.passwordChangeAt.getTime() / 1000, 10);
		return JWTTimestamp < changedTimestamp;
	}
	return false;
};

//创建忘记密码和充值密码的 token
userSchema.methods.createPasswordResetToken = function() {
	//创建一个随机的字符串
	const resetToken = crypto.randomBytes(32).toString('hex');
	//创建忘记密码的token
	this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
	console.log({ resetToken }, this.passwordResetToken);
	//创建时效 10分钟
	this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
	return resetToken;
};


const User = mongoose.model('User', userSchema);
module.exports = User;