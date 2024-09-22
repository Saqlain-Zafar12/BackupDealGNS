const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const authTokenMiddleware = require('../middleware/authTokenMiddleware');

// All dashboard routes should be protected
router.use(authTokenMiddleware);

router.get('/stats', dashboardController.getDashboardStats);
router.get('/revenue', dashboardController.getRevenueStats);
router.get('/product-stats', dashboardController.getProductStats);

router.get('/monthly-revenue', dashboardController.getMonthlyRevenue);
router.get('/monthly-sales', dashboardController.getMonthlySales);
router.get('/weekly-revenue', dashboardController.getWeeklyRevenue);
router.get('/weekly-sales', dashboardController.getWeeklySales);

module.exports = router;
