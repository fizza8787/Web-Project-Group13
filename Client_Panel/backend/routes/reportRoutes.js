const router = require('express').Router();
const { createReport } = require('../controllers/reportController');
const { isAuth } = require('../middleware/authMiddleware');
const { isClient } = require('../middleware/roleMiddleware');

router.post('/', isAuth, isClient, createReport);

module.exports = router;
