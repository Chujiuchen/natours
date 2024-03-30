const express = require('express');
const router = express.Router();
const viewsController = require('../controller/viewsController');
const authController = require('../controller/authController');


// Route to get the overview page
router.get('/', authController.isLoggedIn, viewsController.getOverview);
// Route to get the tour page
router.get('/tour/:slug', authController.isLoggedIn, viewsController.getTour);

router.get('/login', authController.isLoggedIn, viewsController.getLoginFrom);

router.get('/me', authController.protect, viewsController.getAccount);

module.exports = router;