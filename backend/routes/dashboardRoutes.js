const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const authTokenMiddleware = require('../middleware/authTokenMiddleware');

// All dashboard routes should be protected
router.use(authTokenMiddleware);

router.get('/stats', dashboardController.getDashboardStats);
router.get('/revenue', dashboardController.getRevenueStats);
router.get('/product-stats', dashboardController.getProductStats);

module.exports = router;
