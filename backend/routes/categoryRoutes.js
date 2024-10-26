const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const authTokenMiddleware = require('../middleware/authTokenMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// Public routes
router.get('/', categoryController.getAllCategories);
router.get('/:id', categoryController.getCategoryById);

// Protected routes
router.use(authTokenMiddleware);
router.post('/', roleMiddleware(['manager', 'admin']), categoryController.addCategory);
router.delete('/:id', roleMiddleware(['manager', 'admin']), categoryController.deleteCategory);
router.put('/:id', roleMiddleware(['manager', 'admin']), categoryController.updateCategory);

module.exports = router;
