const router = require('express').Router();
const { getLiveRate } = require('../controllers/currencyController');

router.get('/', getLiveRate);

module.exports = router;