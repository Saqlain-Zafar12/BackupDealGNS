const express = require('express');
const router = express.Router();
const brandController = require('../controllers/brandController');
const authTokenMiddleware = require('../middleware/authTokenMiddleware');

// Public routes
router.get('/', brandController.getAllBrands);
router.get('/:id', brandController.getBrandById);

// Protected routes
router.use(authTokenMiddleware);
router.post('/', brandController.addBrand);
router.delete('/:id', brandController.deleteBrand);
router.put('/:id', brandController.updateBrand);

module.exports = router;
