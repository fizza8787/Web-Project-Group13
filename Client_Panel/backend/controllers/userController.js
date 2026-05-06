const User = require('../models/User');

// GET /api/users — Browse freelancers with search + filter
exports.getFreelancers = async (req, res, next) => {
  try {
    const { search, skill, minRating, minHourlyRate, maxHourlyRate, availability, sortBy = 'latest' } = req.query;
    const query = { role: 'freelancer', isActive: true };

    if (search) query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { skills: { $regex: search, $options: 'i' } },
    ];
    if (skill) query.skills = { $regex: skill, $options: 'i' };
    if (availability) query.availability = availability;

    if (minRating) {
      query.rating = { ...(query.rating || {}), $gte: Number(minRating) };
    }
    if (minHourlyRate || maxHourlyRate) {
      query.hourlyRate = {};
      if (minHourlyRate) query.hourlyRate.$gte = Number(minHourlyRate);
      if (maxHourlyRate) query.hourlyRate.$lte = Number(maxHourlyRate);
    }

    const sortMap = {
      latest: { createdAt: -1 },
      rating: { rating: -1 },
      priceLowToHigh: { hourlyRate: 1 },
      priceHighToLow: { hourlyRate: -1 },
    };

    const freelancers = await User.find(query)
      .select('-password')
      .sort(sortMap[sortBy] || sortMap.latest);
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