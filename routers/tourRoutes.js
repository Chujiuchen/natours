const express = require('express');
const tourController = require('../controller/tourController')
const authController = require('../controller/authController');
// const reviewController = require('../controller/reviewController');
const reviewRouter = require('./reviewRoutes');
const router = express.Router();

// router.param('id',tourController.checkId);

router.route('/top-5-tours').get(tourController.aliasTopTours,tourController.getAllTours);
router.route('/tour-stats').get(tourController.getTourStats);
router.route('/').get(authController.protect,tourController.getAllTours).post(tourController.createTour);
router.route('/:id').patch(tourController.updateTour).delete(authController.protect,authController.restrictTo('admin','guide'),tourController.deleteTour).get(tourController.getTour);

//当前用户评论
// router.route('/:tourId/reviews').post(authController.protect,authController.restrictTo('user'),reviewController.createReview);

//使用use方法将reviewRouter挂载到当前路由上，这样就可以在当前路由下使用/reviews路由
router.use('/:tourId/reviews',reviewRouter)

module.exports = router;