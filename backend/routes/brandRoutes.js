const express = require('express');
const router = express.Router();
const brandController = require('../controllers/brandController');
const authTokenMiddleware = require('../middleware/authTokenMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// Public routes
router.get('/', brandController.getAllBrands);
router.get('/:id', brandController.getBrandById);

// Protected routes
router.use(authTokenMiddleware);
router.post('/', roleMiddleware(['manager', 'admin']), brandController.addBrand);
router.delete('/:id', roleMiddleware(['manager', 'admin']), brandController.deleteBrand);
router.put('/:id', roleMiddleware(['manager', 'admin']), brandController.updateBrand);

module.exports = router;
