const axios = require('axios');

exports.getLiveRate = async (req, res, next) => {
  try {
    const { data } = await axios.get(
      `https://api.currencyfreaks.com/v2.0/rates/latest?apikey=${process.env.CURRENCY_FREAKS_API_KEY}&symbols=PKR,USD`
    );
    res.json({ success: true, rates: data.rates });
  } catch (err) { next(err); }
};