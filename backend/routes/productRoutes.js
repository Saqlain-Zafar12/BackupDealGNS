const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authTokenMiddleware = require('../middleware/authTokenMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Public routes
router.get('/active', productController.getAllActiveProducts);
router.get('/:id', productController.getProductDetails);

// Protected routes
router.use(authTokenMiddleware);
router.post('/', upload.fields([
  { name: 'mainImage', maxCount: 1 },
  { name: 'tabImages', maxCount: 5 }
]), productController.addProduct);
router.get('/deactivated/all', productController.getAllDeactivatedProducts);
router.put('/deactivate/:id', productController.deactivateProduct);
router.put('/activate/:id', productController.activateProduct);
router.put('/:id', upload.fields([
  { name: 'mainImage', maxCount: 1 },
  { name: 'tabImages', maxCount: 5 }
]), productController.editProduct);

module.exports = router;
