const mongoose = require("mongoose");
const Proposal = require("../models/Proposal");

const getFreelancerDashboard = async (req, res, next) => {
  try {
    const freelancerId = req.user.id;
    const [total, pending, accepted, rejected, withdrawn, recent, earningsAgg] = await Promise.all([
      Proposal.countDocuments({ freelancerId }),
      Proposal.countDocuments({ freelancerId, status: "pending" }),
      Proposal.countDocuments({ freelancerId, status: "accepted" }),
      Proposal.countDocuments({ freelancerId, status: "rejected" }),
      Proposal.countDocuments({ freelancerId, status: "withdrawn" }),
      Proposal.find({ freelancerId }).sort({ createdAt: -1 }).limit(5).populate("jobId", "title"),
      Proposal.aggregate([
        { $match: { freelancerId: new mongoose.Types.ObjectId(freelancerId), status: "accepted" } },
        { $group: { _id: null, totalEarnings: { $sum: "$bidAmount" } } }
      ])
    ]);

    res.json({
      success: true,
      stats: { total, activeProjects: accepted, summary: { pending, accepted, rejected, withdrawn }, earnings: earningsAgg[0]?.totalEarnings || 0 },
      recent
    });
  } catch (err) { next(err); }
};

module.exports = { getFreelancerDashboard };
