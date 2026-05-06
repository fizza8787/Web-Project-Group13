const router = require("express").Router();
const { submitProposal, getMyProposals, withdrawProposal, editProposal } = require("../controllers/proposalController");
const { isAuth } = require("../middleware/authMiddleware");
const { allowRoles } = require("../middleware/roleMiddleware");

router.post("/", isAuth, allowRoles("freelancer"), submitProposal);
router.get("/me", isAuth, allowRoles("freelancer"), getMyProposals);
router.patch("/:id", isAuth, allowRoles("freelancer"), editProposal);
router.delete("/:id", isAuth, allowRoles("freelancer"), withdrawProposal);

module.exports = router;
