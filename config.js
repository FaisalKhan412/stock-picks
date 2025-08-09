// config.js - Updated for Yahoo Finance API
const STOCKS = {
  longTerm: [
    { 
      symbol: "RELIANCE.NS", 
      notes: "Strong fundamentals",
      exchange: "NSE"
    },
    { 
      symbol: "INFY.NS", 
      notes: "Consistent revenue growth",
      exchange: "NSE"
    }
  ],
  shortTerm: [
    { 
      symbol: "TATASTEEL.NS", 
      notes: "Technical breakout",
      exchange: "NSE"
    },
    { 
      symbol: "HDFCBANK.NS", 
      notes: "Oversold conditions",
      exchange: "NSE" 
    }
  ]
};

// API Configuration (Yahoo Finance)
const API_CONFIG = {
  baseUrl: "https://query1.finance.yahoo.com/v8/finance/chart",
  region: "IN",
  interval: "1d",
  range: "1d"
};

// Display Settings
const DISPLAY = {
  currency: "₹",
  decimalPlaces: 2,
  showExchange: false // Set to true to display (NSE) after symbols
};

// Fallback Data (if API fails)
const FALLBACK_DATA = {
  "RELIANCE.NS": { price: 2450.50, changePercent: 1.25 },
  "INFY.NS": { price: 1650.30, changePercent: -0.50 },
  "TATASTEEL.NS": { price: 120.75, changePercent: 2.10 },
  "HDFCBANK.NS": { price: 1605.60, changePercent: -1.20 }
};