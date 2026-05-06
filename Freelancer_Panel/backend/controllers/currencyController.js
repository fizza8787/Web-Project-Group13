const axios = require("axios");

const getRates = async (req, res, next) => {
  try {
    const response = await axios.get(`https://api.currencyfreaks.com/v2.0/rates/latest?apikey=${process.env.CURRENCY_FREAKS_API_KEY}&symbols=PKR,USD`);
    const usdToPkr = Number(response.data.rates.PKR);
    const pkrToUsd = 1 / usdToPkr;
    res.json({ success: true, rates: { USD_TO_PKR: usdToPkr, PKR_TO_USD: pkrToUsd } });
  } catch (err) { next(err); }
};

module.exports = { getRates };
