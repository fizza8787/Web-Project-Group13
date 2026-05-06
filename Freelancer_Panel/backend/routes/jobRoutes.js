const router = require("express").Router();
const { getJobs, getJobById, recommendJobs } = require("../controllers/jobController");
const { isAuth } = require("../middleware/authMiddleware");
const { allowRoles } = require("../middleware/roleMiddleware");

router.get("/", isAuth, allowRoles("freelancer"), getJobs);
router.post("/recommendations", isAuth, allowRoles("freelancer"), recommendJobs);
router.get("/:id", isAuth, allowRoles("freelancer"), getJobById);

module.exports = router;
