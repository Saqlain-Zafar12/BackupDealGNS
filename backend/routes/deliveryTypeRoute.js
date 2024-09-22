const express = require('express');
const router = express.Router();
const deliveryTypeController = require('../controllers/deliveryTypeController');

// Create a new delivery type
router.post('/', deliveryTypeController.createDeliveryType);

// Get all delivery types
router.get('/', deliveryTypeController.getAllDeliveryTypes);

// Get a single delivery type by ID
router.get('/:id', deliveryTypeController.getDeliveryTypeById);

// Update a delivery type
router.put('/:id', deliveryTypeController.updateDeliveryType);

// Delete a delivery type
router.delete('/:id', deliveryTypeController.deleteDeliveryType);

module.exports = router;
