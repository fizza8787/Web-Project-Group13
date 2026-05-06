const mongoose = require("mongoose");

const portfolioSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, default: "" }
}, { _id: true });

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["client", "freelancer", "admin"], default: "freelancer" },
  skills: { type: [String], default: [] },
  bio: { type: String, default: "" },
  profileImage: { type: String, default: "" },
  portfolio: { type: [portfolioSchema], default: [] },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
