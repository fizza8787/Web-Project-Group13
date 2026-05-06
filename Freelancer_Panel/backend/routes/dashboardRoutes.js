const router = require("express").Router();
const { getFreelancerDashboard } = require("../controllers/dashboardController");
const { isAuth } = require("../middleware/authMiddleware");
const { allowRoles } = require("../middleware/roleMiddleware");

router.get("/freelancer", isAuth, allowRoles("freelancer"), getFreelancerDashboard);

module.exports = router;
