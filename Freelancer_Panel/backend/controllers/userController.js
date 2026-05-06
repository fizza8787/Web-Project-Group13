const User = require("../models/User");
const cloudinary = require("../config/cloudinary");

const parseSkills = (skills) => Array.isArray(skills) ? skills : String(skills || "").split(",").map((s) => s.trim()).filter(Boolean);

const getMyProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json({ success: true, user });
  } catch (err) { next(err); }
};

const updateMyProfile = async (req, res, next) => {
  try {
    const payload = { ...req.body };
    if (payload.skills) payload.skills = parseSkills(payload.skills);
    if (req.file) {
      const imageData = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
      const uploadResult = await cloudinary.uploader.upload(imageData, { folder: "freelancehub/profiles" });
      payload.profileImage = uploadResult.secure_url;
    }
    const user = await User.findByIdAndUpdate(req.user.id, payload, { new: true }).select("-password");
    res.json({ success: true, user });
  } catch (err) { next(err); }
};

const addPortfolioItem = async (req, res, next) => {
  try {
    const { title, description, image } = req.body;
    let imageUrl = image || "";
    if (req.file) {
      const imageData = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
      const uploadResult = await cloudinary.uploader.upload(imageData, { folder: "freelancehub/portfolio" });
      imageUrl = uploadResult.secure_url;
    }
    const user = await User.findById(req.user.id);
    user.portfolio.push({ title, description, image: imageUrl });
    await user.save();
    res.status(201).json({ success: true, portfolio: user.portfolio });
  } catch (err) { next(err); }
};

const updatePortfolioItem = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    const item = user.portfolio.id(req.params.itemId);
    if (!item) return res.status(404).json({ success: false, message: "Portfolio item not found", statusCode: 404 });

    item.title = req.body.title ?? item.title;
    item.description = req.body.description ?? item.description;
    if (req.file) {
      const imageData = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
      const uploadResult = await cloudinary.uploader.upload(imageData, { folder: "freelancehub/portfolio" });
      item.image = uploadResult.secure_url;
    } else {
      item.image = req.body.image ?? item.image;
    }

    await user.save();
    res.json({ success: true, portfolio: user.portfolio });
  } catch (err) { next(err); }
};

const deletePortfolioItem = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    user.portfolio.pull(req.params.itemId);
    await user.save();
    res.json({ success: true, portfolio: user.portfolio });
  } catch (err) { next(err); }
};

module.exports = { getMyProfile, updateMyProfile, addPortfolioItem, updatePortfolioItem, deletePortfolioItem };
