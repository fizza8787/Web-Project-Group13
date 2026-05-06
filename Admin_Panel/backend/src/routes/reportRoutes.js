const express = require("express");
const { isAuth } = require("../middleware/authMiddleware");
const { createReport } = require("../controllers/adminController");

const router = express.Router();

router.post("/", isAuth, createReport);

module.exports = router;
