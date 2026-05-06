const jwt = require("jsonwebtoken");
const User = require("../models/User");

const isAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : authHeader;

  if (!token) {
    return res.status(401).json({ success: false, message: "Unauthorized", statusCode: 401 });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user || !user.isActive) {
      return res.status(401).json({ success: false, message: "Unauthorized", statusCode: 401 });
    }
    req.user = { id: String(user._id), role: user.role, email: user.email, name: user.name };
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid token", statusCode: 401 });
  }
};

module.exports = { isAuth };
