const express = require('express');
const router = express.Router();

const userController = require('../controller/userController');
const authController = require('../controller/authController');

router.route('/signup').post(authController.signup);
router.route('/login').post(authController.login);
router.route('/logout').get(authController.logout);

router.route('/forgotPassword').patch(authController.forgotPassword);
router.route('/resetPassword/:token').patch(authController.resetPassword);

//保护后面所有的路由都需要登录验证
router.use(authController.protect);
router.route('/updateMyPassword').patch(authController.updatePassword);
router.route('/me').get(userController.getMe, userController.getUser); //通过getMe函数获取当前用户信息 然后在getUser函数中获取详细信息
router
	.route('/updateMe')
	.patch(userController.uploadUserPhoto, userController.resizeUserPhoto, userController.updataMe);
router.route('/deleteMe').delete(userController.deleteMe);

//admin才能访问的路由
router.use(authController.restrictTo('admin'));
router
	.route('/')
	.get(userController.getAllUsers)
	.post(userController.createUser);
router
	.route('/:id')
	.patch(userController.updateUser)
	.delete(userController.deleteUser)
	.get(userController.getUser);

module.exports = router;
