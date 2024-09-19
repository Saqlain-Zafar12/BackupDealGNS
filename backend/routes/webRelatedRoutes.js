const express = require('express');
const router = express.Router();
const WebRelatedController = require('../controllers/webRelatedController');

router.get('/recommended-products', WebRelatedController.getRecommendedProducts);
router.get('/super-deals', WebRelatedController.getSuperDeals);
router.get('/product/:id', WebRelatedController.getWebProductDataById);
router.post('/create-order', WebRelatedController.createWebOrder);

module.exports = router;
