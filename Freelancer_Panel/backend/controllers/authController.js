const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const signToken = (user) => jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ success: false, message: "Missing required fields", statusCode: 400 });
    if (password.length < 8) return res.status(400).json({ success: false, message: "Password must be at least 8 characters", statusCode: 400 });

    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) return res.status(409).json({ success: false, message: "Email already in use", statusCode: 409 });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email: email.toLowerCase(), password: hashed, role: "freelancer" });
    const token = signToken(user);
    res.status(201).json({ success: true, token, user });
  } catch (err) { next(err); }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email?.toLowerCase() });
    if (!user || user.role !== "freelancer") return res.status(401).json({ success: false, message: "Invalid credentials", statusCode: 401 });
    const matched = await bcrypt.compare(password, user.password);
    if (!matched) return res.status(401).json({ success: false, message: "Invalid credentials", statusCode: 401 });
    const token = signToken(user);
    res.json({ success: true, token, user });
  } catch (err) { next(err); }
};

module.exports = { register, login };
