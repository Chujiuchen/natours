const nodemailer = require('nodemailer');

const sendEmail = async options => {
	//创建一个发邮件的功能
	const transporter = nodemailer.createTransport({
		//从配置中读取邮件数据
		host: process.env.EMAIL_HOST,
		port: process.env.EMAIL_PORT,
		auth: {
			user: process.env.EMAIL_USERNAME,
			pass: process.env.EMAIL_PASSWORD
		}
	});
	//定义邮件的选项
	const mailOptions = {
		from: 'letchujiufly@outlook.com',
		to: options.email,
		subject: options.subject,
		text: options.message
		// html:
	};

	//发送邮件
	await transporter.sendMail(mailOptions, (error, info) => {
		if (error) {
			console.error('Error sending email:', error);
		} else {
			console.log('Email sent:', info.response);
		}
	});
};

module.exports = sendEmail;