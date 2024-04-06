const express = require('express');
const tourController = require('../controller/tourController');
const authController = require('../controller/authController');
// const reviewController = require('../controller/reviewController');
const reviewRouter = require('./reviewRoutes');
const router = express.Router();

// router.param('id',tourController.checkId);

router.route('/top-5-tours').get(tourController.aliasTopTours, tourController.getAllTours);
router.route('/tour-stats').get(tourController.getTourStats);
router.route('/')
	.get(tourController.getAllTours)
	.post(authController.protect, authController.restrictTo('admin', 'lead-guide'), tourController.createTour);
router.route('/:id')
	.get(tourController.getTour)
	.patch(
		authController.protect,
		authController.restrictTo('admin', 'lead-guide'),
		tourController.uploadTourImages,
		tourController.resizeTourImages,
		tourController.updateTour)
	.delete(authController.protect, authController.restrictTo('admin', 'lead-guide'), tourController.deleteTour);

router.route('/tours-within/:distance/center/:latlng/unit/:unit')
	.get(tourController.getToursWithin);
router.route('/distances/:latlng/unit/:unit')
	.get(tourController.getDistances);

//使用use方法将reviewRouter挂载到当前路由上，这样就可以在当前路由下使用/reviews路由
router.use('/:tourId/reviews', reviewRouter);

module.exports = router;