const authController = require('./../controller/authController');
const express = require('express');
const bookingController = require('./../controller/bookingController');

const router = express.Router();


router.get('/checkout-session/:tourId', authController.protect, bookingController.getCheckoutSession);


module.exports = router;