const nodemailer = require('nodemailer');
const htmlToText = require('html-to-text');
const pug = require('pug');

module.exports = class Email {
	constructor(user, url) {
		this.to = user.email; // 设置邮件接收者地址
		this.firstName = user.name.split(' ')[0]; // 从用户的名字中获取第一个名字
		this.url = url; // 存储传递来的URL
		this.from = `Chujiu Chen<${process.env.EMAIL_FROM}>`; // 设置发件人的名称和邮件来源地址
	}

	newTransport() {
		if (process.env.NODE_ENV === 'production') {
			return 1; // 如果应用处于生产环境，则直接返回1
		}

		return nodemailer.createTransport({
			// 创建并返回一个Nodemailer传输器，用于发送邮件
			host: process.env.EMAIL_HOST, // 设置邮件服务器主机
			port: process.env.EMAIL_PORT, // 设置邮件服务器端口
			auth: {
				user: process.env.EMAIL_USERNAME, // 设置邮件服务器的用户名
				pass: process.env.EMAIL_PASSWORD // 设置邮件服务器的密码
			}
		});
	}

	// 发送邮件的方法
	async send(template, subject) {
		// 1）渲染邮件模板为HTML内容
		const html = pug.renderFile(
			`${__dirname}/../views/email/${template}.pug`, // 使用Pug模板引擎渲染指定的模板文件
			{
				firstName: this.firstName, // 传递用户的第一个名字
				url: this.url, // 传递URL
				subject // 传递邮件主题
			}
		);

		const text = htmlToText.fromString(html); // 使用html-to-text库将HTML内容转换为纯文本
		// 2）定义邮件选项
		const mailOptions = {
			from: this.from, // 设置邮件发件人
			to: this.to, // 设置邮件接收人
			subject, // 设置邮件主题
			html, // 设置HTML格式的邮件内容
			text// 使用html-to-text库将HTML内容转换为纯文本
		};

		// 3）创建传输器并发送邮件
		this.newTransport().sendMail(mailOptions); // 使用新创建的传输器发送邮件
	};

	async sendWelcome() {
		await this.send('welcome', 'Welcome to Natours Family!'); // 调用send方法发送欢迎邮件
	}

	async sendPasswordReset() {
		await this.send('passwordReset', 'Your password reset link (valid for 10 minutes)!'); // 调用send方法发送密码重置邮件
	}
};
