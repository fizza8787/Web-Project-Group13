const Job = require("../models/Job");
const Proposal = require("../models/Proposal");
const Report = require("../models/Report");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

exports.getStats = async (req, res, next) => {
  try {
    const [users, jobs, proposals, pendingReports] = await Promise.all([
      User.countDocuments(),
      Job.countDocuments(),
      Proposal.countDocuments(),
      Report.countDocuments({ status: "pending" })
    ]);
    res.json({ success: true, users, jobs, proposals, pendingReports });
  } catch (error) {
    next(error);
  }
};

exports.getAllUsers = async (req, res, next) => {
  try {
    const { keyword = "", role, active } = req.query;
    const filter = {};

    if (keyword) {
      filter.$or = [
        { name: { $regex: keyword, $options: "i" } },
        { email: { $regex: keyword, $options: "i" } }
      ];
    }

    if (role) filter.role = role;
    if (active === "true") filter.isActive = true;
    if (active === "false") filter.isActive = false;

    const users = await User.find(filter).select("-password").sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (error) {
    next(error);
  }
};

exports.createUser = async (req, res, next) => {
  try {
    const { name, email, password, role = "client" } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "Name, email, and password are required" });
    }
    const allowedRoles = ["client", "freelancer", "admin"];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ success: false, message: "Invalid role" });
    }
    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) return res.status(409).json({ success: false, message: "Email already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashed,
      role
    });
    res.status(201).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const { name, role, isActive } = req.body;
    const patch = {};
    if (name) patch.name = name;
    if (typeof isActive === "boolean") patch.isActive = isActive;
    if (role) {
      const allowedRoles = ["client", "freelancer", "admin"];
      if (!allowedRoles.includes(role)) {
        return res.status(400).json({ success: false, message: "Invalid role" });
      }
      patch.role = role;
    }

    const user = await User.findByIdAndUpdate(req.params.id, patch, { new: true }).select("-password");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

exports.toggleUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    user.isActive = !user.isActive;
    await user.save();
    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    if (user.role === "admin") {
      return res.status(400).json({ success: false, message: "Admin account cannot be deleted" });
    }
    await user.deleteOne();
    res.json({ success: true, message: "User deleted" });
  } catch (error) {
    next(error);
  }
};

exports.getAllJobs = async (req, res, next) => {
  try {
    const { keyword = "", status } = req.query;
    const filter = {};

    if (keyword) {
      filter.$or = [
        { title: { $regex: keyword, $options: "i" } },
        { category: { $regex: keyword, $options: "i" } },
        { skillsRequired: { $elemMatch: { $regex: keyword, $options: "i" } } }
      ];
    }
    if (status) filter.status = status;

    const jobs = await Job.find(filter).populate("clientId", "name email").sort({ createdAt: -1 });
    res.json({ success: true, jobs });
  } catch (error) {
    next(error);
  }
};

exports.updateJobStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const allowed = ["approved", "rejected", "open", "closed", "flagged", "in-progress"];
    if (!allowed.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    const job = await Job.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!job) return res.status(404).json({ success: false, message: "Job not found" });
    res.json({ success: true, job });
  } catch (error) {
    next(error);
  }
};

exports.deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ success: false, message: "Job not found" });
    await job.deleteOne();
    res.json({ success: true, message: "Job removed" });
  } catch (error) {
    next(error);
  }
};

exports.getReports = async (req, res, next) => {
  try {
    const reports = await Report.find().populate("reportedUser", "name email role").sort({ createdAt: -1 });
    res.json({ success: true, reports });
  } catch (error) {
    next(error);
  }
};

exports.resolveReport = async (req, res, next) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ success: false, message: "Report not found" });
    report.status = "resolved";
    await report.save();
    res.json({ success: true, report });
  } catch (error) {
    next(error);
  }
};

exports.createReport = async (req, res, next) => {
  try {
    const { reportedUser, reason } = req.body;
    if (!reportedUser || !reason) {
      return res.status(400).json({ success: false, message: "reportedUser and reason are required" });
    }
    const user = await User.findById(reportedUser);
    if (!user) return res.status(404).json({ success: false, message: "Reported user not found" });

    const report = await Report.create({ reportedUser, reason });
    res.status(201).json({ success: true, report });
  } catch (error) {
    next(error);
  }
};
