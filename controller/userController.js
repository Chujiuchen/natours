const multer = require('multer');
const sharp = require('sharp');
const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./handlerFactory');

// 设置 multer 存储配置，指定上传文件的目标路径和文件名
// const multerStorage = multer.diskStorage({
// 	destination: (req, file, cb) => {
// 		cb(null, 'public/img/users'); // 将上传文件存储到指定目录
// 	},
// 	filename: (req, file, cb) => {
// 		const ext = file.mimetype.split('/')[1]; // 获取文件扩展名
// 		cb(null, `user-${req.user.id}-${Date.now()}.${ext}`); // 设置文件名格式
// 	},
// });
const multerStorage = multer.memoryStorage();

// 设置 multer 文件过滤器，检查文件类型是否为图像
const multerFilter = (req, file, cb) => {
	if (file.mimetype.startsWith('image')) {
		cb(null, true); // 符合条件，允许上传
	} else {
		cb(new AppError('Please upload an image file', 400), false); // 不符合条件，返回错误信息
	}
};

// 创建 upload 对象，应用存储配置和文件过滤器
const upload = multer({
	storage: multerStorage,
	fileFilter: multerFilter,
});

exports.uploadUserPhoto = upload.single('photo');

// Resize user's photo if a file is uploaded, then store the resized image on the server
exports.resizeUserPhoto = catchAsync( async (req, res, next) => {
 if (!req.file) return next(); // If no file is uploaded, skip to the next middleware

 // Append unique filename and format to the uploaded image
 req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

 // Use sharp to resize, convert, and save the image
 await sharp(req.file.buffer)
  .resize(500, 500)
  .toFormat('jpeg')
  .jpeg({ quality: 90 })
  .toFile(`public/img/users/${req.file.filename}`);
 next(); // Call the next middleware
});

const filterObj = (obj, ...allowedFields) => {
	const newObj = {};
	Object.keys(obj).forEach((el) => {
		if (allowedFields.includes(el)) {
			newObj[el] = obj[el];
		}
	});
	return newObj;
};

//获取当前用户id
exports.getMe = catchAsync(async (req, res, next) => {
	req.params.id = req.user.id;
	next();
});

//更新用户的信息
exports.updataMe = catchAsync(async (req, res, next) => {
	// console.log(111)
	//安全判断 如果包含密码直接弹个错误
	if (req.body.password || req.body.passwordConfirm) {
		return next(
			new AppError(
				'This route is not for password update.Please use /updateMyPassword',
				400
			)
		);
	}

	//验证只允许更新的字段
	const filteredBody = filterObj(req.body, 'name', 'email');
	// 如果 req 对象中存在 file 属性
	if (req.file) {
		// 则将 filteredBody 对象中的 photo 属性设置为 req 对象中 file 属性的文件名
		filteredBody.photo = req.file.filename;
	}
	// console.log(filteredBody);
	//更新用户数据 避免创建的验证信息 用findByIdAndUpdate(id,运行更新的字段,设置)
	const updateUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
		new: true,
		runValidators: true,
	});

	res.status(200).json({
		status: 'success',
		data: {
			user: updateUser,
		},
	});
});

//删除用户把活跃标记为false  不进行如何数据删除 只把数据标记为非活跃用户
exports.deleteMe = catchAsync(async (req, res, next) => {
	await User.findByIdAndUpdate(req.user.id, { active: false });
	res.status(204).json({
		status: 'success',
		data: null,
	});
});

//获取所有用户数据
exports.getAllUsers = factory.getAll(User);
//调用工厂函数 获取单个用户数据
exports.getUser = factory.getOne(User);
//调用工厂的创建函数
exports.createUser = factory.createOne(User);
//调用工厂的更新函数
exports.updateUser = factory.updateOne(User);
//调用工厂的删除函数
exports.deleteUser = factory.deleteOne(User);
