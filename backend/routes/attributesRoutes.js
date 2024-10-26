const express = require('express');
const router = express.Router();
const attributesController = require('../controllers/attributesController');
const authTokenMiddleware = require('../middleware/authTokenMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// Public routes
router.get('/', attributesController.getAllAttributes);
router.get('/:id', attributesController.getAttributeById);

// Protected routes
router.use(authTokenMiddleware);
router.post('/', roleMiddleware(['manager', 'admin']), attributesController.addAttribute);
router.delete('/:id', roleMiddleware(['manager', 'admin']), attributesController.deleteAttribute);
router.put('/:id', roleMiddleware(['manager', 'admin']), attributesController.updateAttribute);

module.exports = router;
