const Proposal = require('../models/Proposal');
const Job = require('../models/Job');

// GET /api/proposals/:jobId
exports.getProposalsForJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
    if (String(job.clientId) !== String(req.user._id)) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const proposals = await Proposal.find({ jobId: req.params.jobId })
      .populate('freelancerId', 'name email skills profileImage bio');
    res.json({ success: true, proposals });
  } catch (err) { next(err); }
};

// PUT /api/proposals/:id/status — Client accepts or rejects
exports.updateProposalStatus = async (req, res, next) => {
  try {
    const allowedStatuses = ['pending', 'accepted', 'rejected'];
    if (!allowedStatuses.includes(req.body.status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value' });
    }

    const proposal = await Proposal.findById(req.params.id);
    if (!proposal) return res.status(404).json({ success: false, message: 'Proposal not found' });

    const job = await Job.findById(proposal.jobId);
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
    if (String(job.clientId) !== String(req.user._id)) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    proposal.status = req.body.status;
    await proposal.save();
    res.json({ success: true, proposal });
  } catch (err) { next(err); }
};