const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const s3Controller = require('../controllers/s3Controller');
const authTokenMiddleware = require('../middleware/authTokenMiddleware');
const upload = require('../middleware/uploadMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// Public routes
router.get('/active', productController.getAllActiveProducts);
router.get('/:id', productController.getProductDetails);

// Protected routes
router.use(authTokenMiddleware);
router.post('/', roleMiddleware(['manager', 'admin']), upload.fields([
  { name: 'mainImage', maxCount: 1 },
  { name: 'tabImages', maxCount: 5 }
]), productController.addProduct);
router.get('/deactivated/all', roleMiddleware(['manager', 'admin']), productController.getAllDeactivatedProducts);
router.put('/deactivate/:id', roleMiddleware(['manager', 'admin']), productController.deactivateProduct);
router.put('/activate/:id', roleMiddleware(['manager', 'admin']), productController.activateProduct);
router.put('/:id', roleMiddleware(['manager', 'admin']), upload.fields([
  { name: 'mainImage', maxCount: 1 },
  { name: 'tabImages', maxCount: 5 }
]), productController.editProduct);

// New S3 routes
router.post('/upload-image', authTokenMiddleware, upload.single('image'), s3Controller.uploadImage);
router.delete('/delete-image/:key', authTokenMiddleware, s3Controller.deleteImage);

module.exports = router;
