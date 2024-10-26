const express = require('express');
const router = express.Router();
const managerDashboardController = require('../controllers/managerDashboardController');
const authTokenMiddleware = require('../middleware/authTokenMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// All manager dashboard routes should be protected
router.use(authTokenMiddleware);
router.use(roleMiddleware(['manager', 'admin']));

router.get('/stats', managerDashboardController.getStats);

module.exports = router;
