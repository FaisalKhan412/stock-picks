// Stock symbols configuration (USE .BO for BSE or .NS for NSE)
const STOCKS = {
  longTerm: [
    { symbol: "RELIANCE.BO", notes: "Strong fundamentals" },  // BSE
    { symbol: "INFY.NS", notes: "Consistent revenue growth" }, // NSE (sometimes more reliable)
    { symbol: "TATAMOTORS.BO", notes: "Test stock" }  // For verification
  ],
  shortTerm: [
    { symbol: "HDFCBANK.BO", notes: "Oversold conditions" },  // BSE
    { symbol: "TCS.NS", notes: "Technical breakout" }  // NSE
  ]
};

// API Configuration (Alpha Vantage)
const API_CONFIG = {
  apiKey: "6CUWCEKKTSLIXQ7L", // Your API key
  baseUrl: "https://www.alphavantage.co/query",
  function: "GLOBAL_QUOTE", // For stock prices
  forexFunction: "CURRENCY_EXCHANGE_RATE", // For USD to INR conversion
  fromCurrency: "USD",
  toCurrency: "INR"
};

// Fallback exchange rate if API fails (1 USD = ~83 INR as of 2023)
const FALLBACK_EXCHANGE_RATE = 83; 