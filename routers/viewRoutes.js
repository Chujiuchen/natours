const express = require('express');
const router = express.Router();
const viewsController = require('../controller/viewsController');

// Route to get the overview page
router.get('/', viewsController.getOverview);
// Route to get the tour page
router.get('/tour', viewsController.getTour);

module.exports = router;