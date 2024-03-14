const express = require('express');
const tourController = require('../controller/tourController')
const authController = require('../controller/authController');
const reviewController = require('../controller/reviewController');
const router = express.Router();

// router.param('id',tourController.checkId);

router.route('/top-5-tours').get(tourController.aliasTopTours,tourController.getAllTours);
router.route('/tour-stats').get(tourController.getTourStats);
router.route('/').get(authController.protect,tourController.getAllTours).post(tourController.createTour);
router.route('/:id').patch(tourController.updateTour).delete(authController.protect,authController.restrictTo('admin','guide'),tourController.deleteTour).get(tourController.getTour);

//当前用户评论
router.route('/:tourId/reviews').post(authController.protect,authController.restrictTo('user'),reviewController.createReview);

module.exports = router;