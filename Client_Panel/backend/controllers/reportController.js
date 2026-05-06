const Report = require('../models/Report');
const User = require('../models/User');

exports.createReport = async (req, res, next) => {
  try {
    const { reportedUser, reason } = req.body;
    if (!reportedUser || !reason?.trim()) {
      return res.status(400).json({ success: false, message: 'reportedUser and reason are required' });
    }

    const target = await User.findById(reportedUser);
    if (!target) return res.status(404).json({ success: false, message: 'Reported user not found' });

    const report = await Report.create({
      reportedUser,
      reason: reason.trim(),
      status: 'pending',
    });

    res.status(201).json({ success: true, report });
  } catch (err) { next(err); }
};
