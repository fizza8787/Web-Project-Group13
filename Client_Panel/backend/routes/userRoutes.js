const router = require('express').Router();
const { getFreelancers, getUserById } = require('../controllers/userController');

router.get('/',    getFreelancers);
router.get('/:id', getUserById);

module.exports = router;