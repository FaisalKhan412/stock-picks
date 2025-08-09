// Stock symbols configuration
const STOCKS = {
  longTerm: [
    { symbol: "RELIANCE.BO", notes: "Strong fundamentals" },
    { symbol: "INFY.BO", notes: "Consistent revenue growth" }
  ],
  shortTerm: [
    { symbol: "TATASTEEL.BO", notes: "Technical breakout" },
    { symbol: "HDFCBANK.BO", notes: "Oversold conditions" }
  ]
};

// API Configuration
const API_CONFIG = {
  apiKey: "6CUWCEKKTSLIXQ7L",
  baseUrl: "https://www.alphavantage.co/query",
  forexFunction: "CURRENCY_EXCHANGE_RATE",
  stockFunction: "GLOBAL_QUOTE",
  fromCurrency: "USD",
  toCurrency: "INR"
};