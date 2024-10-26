const express = require('express');
const router = express.Router();
const deliveryTypeController = require('../controllers/deliveryTypeController');
const roleMiddleware = require('../middleware/roleMiddleware');
const authTokenMiddleware = require('../middleware/authTokenMiddleware');

// Protected routes
router.use(authTokenMiddleware);

// Create a new delivery type
router.post('/', roleMiddleware(['admin']), deliveryTypeController.createDeliveryType);

// Get all delivery types
router.get('/', roleMiddleware(['admin']), deliveryTypeController.getAllDeliveryTypes);

// Get a single delivery type by ID
router.get('/:id', roleMiddleware(['admin']), deliveryTypeController.getDeliveryTypeById);

// Update a delivery type
router.put('/:id', roleMiddleware(['admin']), deliveryTypeController.updateDeliveryType);

// Delete a delivery type
router.delete('/:id', roleMiddleware(['admin']), deliveryTypeController.deleteDeliveryType);

module.exports = router;
