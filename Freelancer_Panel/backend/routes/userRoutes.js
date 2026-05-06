const router = require("express").Router();
const { getMyProfile, updateMyProfile, addPortfolioItem, updatePortfolioItem, deletePortfolioItem } = require("../controllers/userController");
const { isAuth } = require("../middleware/authMiddleware");
const { allowRoles } = require("../middleware/roleMiddleware");
const upload = require("../middleware/uploadMiddleware");

router.get("/me", isAuth, allowRoles("freelancer"), getMyProfile);
router.put("/me", isAuth, allowRoles("freelancer"), upload.single("profileImage"), updateMyProfile);
router.post("/me/portfolio", isAuth, allowRoles("freelancer"), upload.single("image"), addPortfolioItem);
router.put("/me/portfolio/:itemId", isAuth, allowRoles("freelancer"), upload.single("image"), updatePortfolioItem);
router.delete("/me/portfolio/:itemId", isAuth, allowRoles("freelancer"), deletePortfolioItem);

module.exports = router;
