const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const authTokenMiddleware = require('../middleware/authTokenMiddleware');

// Public routes
router.get('/', categoryController.getAllCategories);
router.get('/:id', categoryController.getCategoryById);

// Protected routes
router.use(authTokenMiddleware);
router.post('/', categoryController.addCategory);
router.delete('/:id', categoryController.deleteCategory);
router.put('/:id', categoryController.updateCategory);

module.exports = router;
