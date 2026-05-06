const CURRENCY_FREAKS_URL = "https://api.currencyfreaks.com/v2.0/rates/latest";

const roundTo2 = (value) => Math.round(value * 100) / 100;

exports.getPkrPerUsdRate = async () => {
  const apiKey = process.env.CURRENCY_FREAKS_API_KEY;
  if (!apiKey) {
    throw new Error("Missing CURRENCY_FREAKS_API_KEY in environment");
  }

  const url = `${CURRENCY_FREAKS_URL}?apikey=${encodeURIComponent(apiKey)}&symbols=PKR`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch exchange rates from CurrencyFreaks");
  }

  const data = await response.json();
  const pkrRate = Number(data?.rates?.PKR);
  if (!Number.isFinite(pkrRate) || pkrRate <= 0) {
    throw new Error("Invalid PKR exchange rate received from CurrencyFreaks");
  }

  return pkrRate;
};

exports.convertPkrToUsd = async (amountPkr) => {
  const numericAmount = Number(amountPkr);
  if (!Number.isFinite(numericAmount) || numericAmount < 0) {
    throw new Error("Amount must be a non-negative number");
  }

  const pkrPerUsd = await exports.getPkrPerUsdRate();
  return {
    amountPKR: numericAmount,
    amountUSD: roundTo2(numericAmount / pkrPerUsd),
    pkrPerUsd
  };
};
