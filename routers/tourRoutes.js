const express = require('express');
const tourController = require('../controller/tourController')
const router = express.Router();

// router.param('id',tourController.checkId);

router.route('/top-5-tours').get(tourController.aliasTopTours,tourController.getAllTours);
router.route('/').get(tourController.getAllTours).post(tourController.createTour);
router.route('/:id').patch(tourController.updateTour).delete(tourController.deleteTour).get(tourController.getTour);

module.exports = router;