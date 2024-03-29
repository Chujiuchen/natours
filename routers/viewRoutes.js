const express = require('express');
const router = express.Router();
const viewsController = require('../controller/viewsController');
const authController = require('../controller/authController');

// Route to get the overview page
router.get('/', viewsController.getOverview);
// Route to get the tour page
router.get('/tour/:slug',authController.protect, viewsController.getTour);

router.get('/login',viewsController.getLoginFrom);

module.exports = router;