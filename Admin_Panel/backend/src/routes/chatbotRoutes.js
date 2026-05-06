const express = require("express");
const { isAuth } = require("../middleware/authMiddleware");
const { getJobRecommendations } = require("../controllers/chatbotController");

const router = express.Router();

router.post("/recommendations", isAuth, getJobRecommendations);

module.exports = router;
