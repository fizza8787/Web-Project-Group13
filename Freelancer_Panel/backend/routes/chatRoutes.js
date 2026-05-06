const router = require("express").Router();
const { getConversation } = require("../controllers/chatController");
const { isAuth } = require("../middleware/authMiddleware");
const { allowRoles } = require("../middleware/roleMiddleware");

router.get("/:otherUserId", isAuth, allowRoles("freelancer"), getConversation);

module.exports = router;
