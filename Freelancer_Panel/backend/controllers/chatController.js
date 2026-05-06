const Message = require("../models/Message");

const getConversation = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const otherUserId = req.params.otherUserId;
    const conversationId = [userId, otherUserId].sort().join("_");
    const messages = await Message.find({ conversationId }).sort({ createdAt: 1 });
    res.json({ success: true, messages });
  } catch (err) { next(err); }
};

module.exports = { getConversation };
