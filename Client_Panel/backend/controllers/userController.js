const User = require('../models/User');

// GET /api/users — Browse freelancers with search + filter
exports.getFreelancers = async (req, res, next) => {
  try {
    const { search, skill } = req.query;
    const query = { role: 'freelancer', isActive: true };

    if (search) query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { skills: { $regex: search, $options: 'i' } },
    ];
    if (skill) query.skills = { $regex: skill, $options: 'i' };

    const freelancers = await User.find(query).select('-password');
    res.json({ success: true, freelancers });
  } catch (err) { next(err); }
};

// GET /api/users/:id
exports.getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, user });
  } catch (err) { next(err); }
};