// config.js - Production Ready
const CONFIG = {
  stocks: {
    longTerm: [
      { symbol: "RELIANCE.NS", notes: "Strong fundamentals" },
      { symbol: "INFY.NS", notes: "Consistent revenue growth" }
    ],
    shortTerm: [
      { symbol: "TATASTEEL.NS", notes: "Technical breakout" },
      { symbol: "HDFCBANK.NS", notes: "Oversold conditions" }
    ]
  },
  api: {
    yahooFinance: {
      baseUrl: "https://query1.finance.yahoo.com/v8/finance/chart",
      region: "IN",
      timeout: 8000 // 8 seconds timeout
    }
  },
  display: {
    currency: {
      symbol: "₹",
      position: "before"
    },
    decimalPlaces: 2,
    showExchange: false
  },
  fallbackData: {
    "RELIANCE.NS": { price: 2950.20, changePercent: 1.35 },
    "INFY.NS": { price: 1950.75, changePercent: -0.65 },
    "TATASTEEL.NS": { price: 130.40, changePercent: 2.25 },
    "HDFCBANK.NS": { price: 1700.60, changePercent: -1.10 }
  }
};