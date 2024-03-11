const express = require('express');
const router = express.Router();
const userController = require('../controller/userController')
const authController = require('../controller/authController');

router.route('/signup').post(authController.signup);
router.route('/login').post(authController.login);
router.route('/forgotPassword').post(authController.forgotPassword);

router.route('/').get(userController.getAllUsers).post(userController.createUser);
router.route('/:id').patch(userController.updateUser).delete(userController.deleteUser).get(userController.getUser);

module.exports =router;