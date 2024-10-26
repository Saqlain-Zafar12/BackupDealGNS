const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const authTokenMiddleware = require('../middleware/authTokenMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// All dashboard routes should be protected
router.use(authTokenMiddleware);

router.get('/stats', roleMiddleware(['admin']), dashboardController.getDashboardStats);
router.get('/revenue', roleMiddleware(['admin']), dashboardController.getRevenueStats);
router.get('/product-stats', roleMiddleware(['admin']), dashboardController.getProductStats);

router.get('/monthly-revenue', roleMiddleware(['admin']), dashboardController.getMonthlyRevenue);
router.get('/monthly-sales', roleMiddleware(['admin']), dashboardController.getMonthlySales);
router.get('/weekly-revenue', roleMiddleware(['admin']), dashboardController.getWeeklyRevenue);
router.get('/weekly-sales', roleMiddleware(['admin']), dashboardController.getWeeklySales);

module.exports = router;
