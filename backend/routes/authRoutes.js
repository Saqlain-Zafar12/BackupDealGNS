const express = require('express');
const router = express.Router();
const { register, login, verifyToken } = require('../controllers/authControllers');
const roleMiddleware = require('../middleware/roleMiddleware');
const authTokenMiddleware = require('../middleware/authTokenMiddleware');

router.post('/register', register);
router.post('/login', login);
router.get('/verify-token', verifyToken);

// Example: Protect a route for admins only
router.get('/admin-only', authTokenMiddleware, roleMiddleware('admin'), (req, res) => {
  res.json({ message: 'Welcome, admin!' });
});

module.exports = router;
