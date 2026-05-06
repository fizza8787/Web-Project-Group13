const express = require("express");
const { loginAdmin, registerAdmin } = require("../controllers/authController");

const router = express.Router();

router.post("/admin/register", registerAdmin);
router.post("/admin/login", loginAdmin);

module.exports = router;
