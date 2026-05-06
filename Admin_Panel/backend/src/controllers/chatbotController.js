const Job = require("../models/Job");

const parseSkills = (skillsInput) => {
  if (Array.isArray(skillsInput)) {
    return skillsInput.map((item) => String(item).trim()).filter(Boolean);
  }
  if (typeof skillsInput === "string") {
    return skillsInput
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
};

const buildFallbackRecommendations = async (skills) => {
  const skillRegexes = skills.map((skill) => new RegExp(skill, "i"));
  const jobs = await Job.find({ status: { $in: ["open", "approved"] } })
    .select("title category budget budgetUSD skillsRequired")
    .sort({ createdAt: -1 })
    .limit(30);

  return jobs
    .map((job) => {
      const overlap = (job.skillsRequired || []).filter((jobSkill) => skillRegexes.some((rx) => rx.test(jobSkill)));
      return { job, score: overlap.length };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map(({ job, score }) => ({
      id: job._id,
      title: job.title,
      category: job.category,
      budgetPKR: job.budget,
      budgetUSD: job.budgetUSD,
      skillsRequired: job.skillsRequired,
      matchScore: score
    }));
};

exports.getJobRecommendations = async (req, res, next) => {
  try {
    const skills = parseSkills(req.body.skills);
    if (skills.length === 0) {
      return res.status(400).json({ success: false, message: "Please provide at least one skill" });
    }

    const recommendations = await buildFallbackRecommendations(skills);
    let botMessage = "Matched jobs using platform skill overlap.";

    const geminiApiKey = process.env.GEMINI_API_KEY;
    if (geminiApiKey && recommendations.length > 0) {
      try {
        const prompt = [
          "You are a FreelanceHub assistant.",
          `User skills: ${skills.join(", ")}`,
          "Recommend the best jobs from this list and explain why in 2-4 short bullets.",
          `Jobs JSON: ${JSON.stringify(recommendations)}`
        ].join("\n");

        const geminiResponse = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${encodeURIComponent(
            geminiApiKey
          )}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }]
            })
          }
        );

        if (geminiResponse.ok) {
          const data = await geminiResponse.json();
          const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) {
            botMessage = text;
          }
        }
      } catch (err) {
        // Keep fallback recommendations if Gemini call fails.
      }
    }

    res.json({ success: true, skills, recommendations, botMessage });
  } catch (error) {
    next(error);
  }
};
