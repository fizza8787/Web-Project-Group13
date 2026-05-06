const router = require('express').Router();
const { createJob, getJobs, getJobById, updateJob, deleteJob, getMyJobs } = require('../controllers/jobController');
const { isAuth } = require('../middleware/authMiddleware');
const { isClient } = require('../middleware/roleMiddleware');

router.get('/',      getJobs);
router.get('/my',    isAuth, isClient, getMyJobs);
router.get('/:id',  getJobById);
router.post('/',     isAuth, isClient, createJob);
router.put('/:id',  isAuth, isClient, updateJob);
router.delete('/:id', isAuth, deleteJob);

module.exports = router;