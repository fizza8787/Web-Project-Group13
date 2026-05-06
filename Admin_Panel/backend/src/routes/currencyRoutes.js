const express = require("express");
const { convertCurrency, getLiveRate } = require("../controllers/currencyController");

const router = express.Router();

router.get("/rate", getLiveRate);
router.get("/convert", convertCurrency);
router.post("/convert", convertCurrency);

module.exports = router;
