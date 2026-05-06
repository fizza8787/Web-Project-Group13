const router = require('express').Router();
const { getProposalsForJob, updateProposalStatus } = require('../controllers/proposalController');
const { isAuth } = require('../middleware/authMiddleware');
const { isClient } = require('../middleware/roleMiddleware');

router.get('/:jobId',       isAuth, isClient, getProposalsForJob);
router.put('/:id/status',   isAuth, isClient, updateProposalStatus);

module.exports = router;