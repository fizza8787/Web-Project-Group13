const Job = require('../models/Job');
const axios = require('axios');

// Get USD rate from CurrencyFreaks
const getUSDRate = async () => {
  try {
    const { data } = await axios.get(
      `https://api.currencyfreaks.com/v2.0/rates/latest?apikey=${process.env.CURRENCY_FREAKS_API_KEY}&symbols=PKR,USD`
    );
    const pkrRate = parseFloat(data.rates.PKR);
    return pkrRate;
  } catch { return null; }
};

// POST /api/jobs — Create job
exports.createJob = async (req, res, next) => {
  try {
    const { title, description, budget, category, skillsRequired } = req.body;
    const pkrRate = await getUSDRate();
    const budgetUSD = pkrRate ? parseFloat((budget / pkrRate).toFixed(2)) : 0;

    const job = await Job.create({
      title, description, budget, budgetUSD,
      category, skillsRequired,
      clientId: req.user._id,
    });
    res.status(201).json({ success: true, job });
  } catch (err) { next(err); }
};

// GET /api/jobs — All jobs with search + filter
exports.getJobs = async (req, res, next) => {
  try {
    const { search, category, status, minBudget, maxBudget } = req.query;
    const query = {};

    if (search) query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { skillsRequired: { $regex: search, $options: 'i' } },
      { category: { $regex: search, $options: 'i' } },
    ];
    if (category) query.category = category;
    if (status)   query.status = status;
    if (minBudget || maxBudget) {
      query.budget = {};
      if (minBudget) query.budget.$gte = Number(minBudget);
      if (maxBudget) query.budget.$lte = Number(maxBudget);
    }

    const jobs = await Job.find(query).populate('clientId', 'name email').sort({ createdAt: -1 });
    res.json({ success: true, jobs });
  } catch (err) { next(err); }
};

// GET /api/jobs/:id — Single job
exports.getJobById = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id).populate('clientId', 'name email');
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
    res.json({ success: true, job });
  } catch (err) { next(err); }
};

// PUT /api/jobs/:id — Update job
exports.updateJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
    if (job.clientId.toString() !== req.user._id.toString())
      return res.status(403).json({ success: false, message: 'Not authorized' });

    if (req.body.budget) {
      const pkrRate = await getUSDRate();
      req.body.budgetUSD = pkrRate ? parseFloat((req.body.budget / pkrRate).toFixed(2)) : 0;
    }

    const updated = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, job: updated });
  } catch (err) { next(err); }
};

// DELETE /api/jobs/:id
exports.deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
    if (job.clientId.toString() !== req.user._id.toString() && req.user.role !== 'admin')
      return res.status(403).json({ success: false, message: 'Not authorized' });

    await job.deleteOne();
    res.json({ success: true, message: 'Job deleted' });
  } catch (err) { next(err); }
};

// GET /api/jobs/my — Client ki apni jobs
exports.getMyJobs = async (req, res, next) => {
  try {
    const jobs = await Job.find({ clientId: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, jobs });
  } catch (err) { next(err); }
};