const router = require("express").Router();
const { getRates } = require("../controllers/currencyController");
const { isAuth } = require("../middleware/authMiddleware");

router.get("/", isAuth, getRates);

module.exports = router;
