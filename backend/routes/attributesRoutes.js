const express = require('express');
const router = express.Router();
const attributesController = require('../controllers/attributesController');
const authTokenMiddleware = require('../middleware/authTokenMiddleware');

// Public routes
router.get('/', attributesController.getAllAttributes);
router.get('/:id', attributesController.getAttributeById);

// Protected routes
router.use(authTokenMiddleware);
router.post('/', attributesController.addAttribute);
router.delete('/:id', attributesController.deleteAttribute);
router.put('/:id', attributesController.updateAttribute);

module.exports = router;
