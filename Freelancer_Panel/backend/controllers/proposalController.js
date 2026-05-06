const Proposal = require("../models/Proposal");

const submitProposal = async (req, res, next) => {
  try {
    const { jobId, coverLetter, bidAmount } = req.body;
    const proposal = await Proposal.create({ jobId, coverLetter, bidAmount, freelancerId: req.user.id });
    res.status(201).json({ success: true, proposal });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ success: false, message: "You already submitted proposal for this job", statusCode: 409 });
    }
    next(err);
  }
};

const getMyProposals = async (req, res, next) => {
  try {
    const proposals = await Proposal.find({ freelancerId: req.user.id }).sort({ createdAt: -1 }).populate("jobId", "title budget status");
    res.json({ success: true, proposals });
  } catch (err) { next(err); }
};

const withdrawProposal = async (req, res, next) => {
  try {
    const proposal = await Proposal.findOneAndUpdate({ _id: req.params.id, freelancerId: req.user.id }, { status: "withdrawn" }, { new: true });
    if (!proposal) return res.status(404).json({ success: false, message: "Proposal not found", statusCode: 404 });
    res.json({ success: true, proposal });
  } catch (err) { next(err); }
};

const editProposal = async (req, res, next) => {
  try {
    const proposal = await Proposal.findOneAndUpdate(
      { _id: req.params.id, freelancerId: req.user.id, status: "pending" },
      { coverLetter: req.body.coverLetter, bidAmount: req.body.bidAmount },
      { new: true }
    );
    if (!proposal) return res.status(400).json({ success: false, message: "Only pending proposal can be edited", statusCode: 400 });
    res.json({ success: true, proposal });
  } catch (err) { next(err); }
};

module.exports = { submitProposal, getMyProposals, withdrawProposal, editProposal };
