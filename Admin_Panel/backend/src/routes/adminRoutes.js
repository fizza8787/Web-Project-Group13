const express = require("express");
const { isAuth } = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");
const {
  getStats,
  getAllUsers,
  createUser,
  updateUser,
  toggleUserStatus,
  deleteUser,
  getAllJobs,
  updateJobStatus,
  deleteJob,
  getReports,
  resolveReport
} = require("../controllers/adminController");

const router = express.Router();

router.use(isAuth, role("admin"));

router.get("/stats", getStats);

router.get("/users", getAllUsers);
router.post("/users", createUser);
router.put("/users/:id", updateUser);
router.put("/users/:id/toggle", toggleUserStatus);
router.delete("/users/:id", deleteUser);

router.get("/jobs", getAllJobs);
router.put("/jobs/:id/status", updateJobStatus);
router.delete("/jobs/:id", deleteJob);

router.get("/reports", getReports);
router.put("/reports/:id/resolve", resolveReport);

module.exports = router;
