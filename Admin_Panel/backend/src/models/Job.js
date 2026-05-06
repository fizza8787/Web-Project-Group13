const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    budget: { type: Number, required: true },
    budgetUSD: { type: Number, default: 0 },
    category: { type: String, required: true, trim: true },
    skillsRequired: [{ type: String, trim: true }],
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: {
      type: String,
      enum: ["open", "in-progress", "closed", "approved", "rejected", "flagged"],
      default: "open"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Job", jobSchema);
