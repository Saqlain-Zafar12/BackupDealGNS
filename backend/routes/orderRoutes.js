const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/orderController.js');
const authTokenMiddleware = require('../middleware/authTokenMiddleware.js');

// Public routes
router.post('/', OrderController.createOrder);

// Protected routes
router.use(authTokenMiddleware);
router.get('/pending', OrderController.getPendingOrders);
router.put('/confirm/:id', OrderController.confirmOrder);
router.put('/cancel/:id', OrderController.cancelOrder);
router.put('/deliver/:id', OrderController.deliverOrder); // Add this new route
router.get('/details/:id', OrderController.getOrderDetails);
router.get('/confirmed', OrderController.getConfirmedOrders);
router.get('/delivered', OrderController.getDeliveredOrders);
router.get('/cancelled', OrderController.getCancelledOrders);

module.exports = router;
