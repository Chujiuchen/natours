const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');
const authController = require('../controller/authController');

router.route('/signup').post(authController.signup);
router.route('/login').post(authController.login);
router.route('/forgotPassword').patch(authController.forgotPassword);
router.route('/resetPassword/:token').patch(authController.resetPassword);
router.route('/updateMyPassword').patch(authController.protect, authController.updatePassword);

router.route('/updateMe').post(authController.protect,userController.updataMe);

router.route('/').get(userController.getAllUsers).post(userController.createUser);
router.route('/:id').patch(userController.updateUser).delete(userController.deleteUser).get(userController.getUser);

module.exports = router;