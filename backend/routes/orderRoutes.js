const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/orderController.js');
const authTokenMiddleware = require('../middleware/authTokenMiddleware.js');
const roleMiddleware = require('../middleware/roleMiddleware.js');

// Public routes
router.post('/', OrderController.createOrder);

// Protected routes
router.use(authTokenMiddleware);
router.get('/pending', roleMiddleware(['admin']), OrderController.getPendingOrders);
router.put('/confirm/:id', roleMiddleware(['admin']), OrderController.confirmOrder);
router.put('/cancel/:id', roleMiddleware(['admin']), OrderController.cancelOrder);
router.put('/deliver/:id', roleMiddleware(['admin']), OrderController.deliverOrder);
router.get('/details/:id', roleMiddleware(['admin']), OrderController.getOrderDetails);
router.get('/confirmed', roleMiddleware(['admin']), OrderController.getConfirmedOrders);
router.get('/delivered', roleMiddleware(['admin']), OrderController.getDeliveredOrders);
router.get('/cancelled', roleMiddleware(['admin']), OrderController.getCancelledOrders);
router.put('/:id/assign-delivery-type', roleMiddleware(['admin']), OrderController.assignDeliveryType);

module.exports = router;
