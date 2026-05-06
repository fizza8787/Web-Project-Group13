const router = require('express').Router();
const { register, login, getMe } = require('../controllers/authController');
const { isAuth } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.get('/me', isAuth, getMe);

module.exports = router;