const express = require('express');
const router = express.Router();
const WebRelatedController = require('../controllers/webRelatedController.js');

// Move the search route to the top
router.get('/super-deals', WebRelatedController.getSuperDeals);
router.get('/product/:id', WebRelatedController.getWebProductDataById);
router.post('/create-order', WebRelatedController.createWebOrder);
router.get('/user-orders/:web_user_id', WebRelatedController.getUserOrders);
router.get('/recommended-products', WebRelatedController.getRecommendedProducts);

module.exports = router;
