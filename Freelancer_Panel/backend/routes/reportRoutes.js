const router = require("express").Router();
const { createReport } = require("../controllers/reportController");
const { isAuth } = require("../middleware/authMiddleware");
const { allowRoles } = require("../middleware/roleMiddleware");

router.post("/", isAuth, allowRoles("freelancer"), createReport);

module.exports = router;
