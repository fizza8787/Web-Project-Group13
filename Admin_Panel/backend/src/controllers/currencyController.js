const { convertPkrToUsd, getPkrPerUsdRate } = require("../services/currencyService");

exports.getLiveRate = async (req, res, next) => {
  try {
    const rate = await getPkrPerUsdRate();
    res.json({ success: true, pkrPerUsd: rate });
  } catch (error) {
    next(error);
  }
};

exports.convertCurrency = async (req, res, next) => {
  try {
    const amountPKR = req.query.amountPKR ?? req.body?.amountPKR ?? 0;
    const result = await convertPkrToUsd(amountPKR);
    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};
