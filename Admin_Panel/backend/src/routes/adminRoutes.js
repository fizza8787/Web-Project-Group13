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
  globalSearch,
  updateJobStatus,
  deleteJob,
  syncJobBudgets,
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
router.get("/search", globalSearch);
router.put("/jobs/:id/status", updateJobStatus);
router.delete("/jobs/:id", deleteJob);
router.put("/jobs/sync-budgets", syncJobBudgets);

router.get("/reports", getReports);
router.put("/reports/:id/resolve", resolveReport);

module.exports = router;
