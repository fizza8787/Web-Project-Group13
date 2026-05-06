const Job = require("../models/Job");
const axios = require("axios");

const getJobs = async (req, res, next) => {
  try {
    const { search, min, max, category, sort = "latest" } = req.query;
    const query = { status: "open" };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { skillsRequired: { $elemMatch: { $regex: search, $options: "i" } } }
      ];
    }

    if (min || max) {
      query.budget = {};
      if (min) query.budget.$gte = Number(min);
      if (max) query.budget.$lte = Number(max);
    }

    if (category) query.category = category;

    const sortMap = { latest: { createdAt: -1 }, highest: { budget: -1 } };
    const jobs = await Job.find(query).sort(sortMap[sort] || sortMap.latest).populate("clientId", "name");
    res.json({ success: true, jobs });
  } catch (err) { next(err); }
};

const getJobById = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id).populate("clientId", "name");
    if (!job) return res.status(404).json({ success: false, message: "Job not found", statusCode: 404 });
    res.json({ success: true, job });
  } catch (err) { next(err); }
};

const recommendJobs = async (req, res, next) => {
  try {
    const inputSkills = (req.body.skills || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    if (!inputSkills.length) {
      return res.status(400).json({ success: false, message: "Skills are required", statusCode: 400 });
    }

    const openJobs = await Job.find({ status: "open" })
      .select("title category skillsRequired budget")
      .sort({ createdAt: -1 })
      .limit(30);

    // Fallback local scoring if Gemini key is unavailable.
    const fallback = openJobs
      .map((job) => {
        const required = (job.skillsRequired || []).map((s) => String(s).toLowerCase());
        const score = inputSkills.reduce(
          (acc, skill) => (required.some((r) => r.includes(skill.toLowerCase())) ? acc + 1 : acc),
          0
        );
        return { job, score };
      })
      .sort((a, b) => b.score - a.score || b.job.budget - a.job.budget)
      .slice(0, 5)
      .map((entry) => entry.job);

    if (!process.env.GEMINI_API_KEY) {
      return res.json({ success: true, source: "local-fallback", jobs: fallback });
    }

    const prompt = `
Given freelancer skills: ${inputSkills.join(", ")}
Rank the best matching jobs from this JSON list and return only a JSON array of up to 5 job _id values in order:
${JSON.stringify(openJobs)}
`;

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;
    const { data } = await axios.post(geminiUrl, {
      contents: [{ parts: [{ text: prompt }] }]
    });

    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "[]";
    const parsedIds = JSON.parse(text.match(/\[[\s\S]*\]/)?.[0] || "[]");
    const validIds = parsedIds.filter((id) => openJobs.some((j) => String(j._id) === String(id)));

    const jobs = validIds.length
      ? validIds.map((id) => openJobs.find((j) => String(j._id) === String(id))).filter(Boolean)
      : fallback;

    return res.json({ success: true, source: "gemini", jobs });
  } catch (err) {
    return next(err);
  }
};

module.exports = { getJobs, getJobById, recommendJobs };
