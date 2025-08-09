// DOM Elements (keep your existing elements)
const loadingEl = document.getElementById('loading');
const errorEl = document.getElementById('error');

// New API Configuration (Yahoo Finance - no CORS issues)
async function fetchStockData(symbol) {
  try {
    loadingEl.classList.remove('hidden');
    errorEl.classList.add('hidden');
    
    // Yahoo Finance API (works directly in browser)
    const response = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?region=IN`);
    const data = await response.json();
    
    if (!data.chart?.result) throw new Error('Invalid symbol or no data');
    
    const price = data.chart.result[0].meta.regularMarketPrice.toFixed(2);
    const changePercent = (
      ((data.chart.result[0].meta.regularMarketPrice - 
       data.chart.result[0].meta.chartPreviousClose) / 
       data.chart.result[0].meta.chartPreviousClose * 100
    ).toFixed(2);
    
    return {
      price: '₹' + price,
      change: changePercent + '%',
      rawChange: changePercent
    };
  } catch (error) {
    console.error('Error:', error);
    errorEl.querySelector('.error-message').textContent = 
      `Failed to load ${symbol}: ${error.message}`;
    errorEl.classList.remove('hidden');
    return null;
  } finally {
    loadingEl.classList.add('hidden');
  }
}

// Updated createStockRow function
function createStockRow(stock, data) {
  const row = document.createElement('tr');
  
  ['symbol', 'price', 'change', 'notes'].forEach(key => {
    const cell = document.createElement('td');
    cell.textContent = key === 'symbol' ? stock.symbol.replace('.BO', '') :
                       key === 'price' ? (data?.price || 'ERR') :
                       key === 'change' ? (data?.change || 'N/A') :
                       stock.notes;
    
    if (key === 'change' && data) {
      cell.style.color = data.rawChange >= 0 ? 'green' : 'red';
    }
    
    row.appendChild(cell);
  });
  
  return row;
}

// Initialize with Yahoo-compatible symbols
const STOCKS = {
  longTerm: [
    { symbol: "RELIANCE.NS", notes: "Strong fundamentals" },
    { symbol: "INFY.NS", notes: "Consistent revenue growth" }
  ],
  shortTerm: [
    { symbol: "TATASTEEL.NS", notes: "Technical breakout" },
    { symbol: "HDFCBANK.NS", notes: "Oversold conditions" }
  ]
};

// Update tables
async function updateStocks() {
  const tables = {
    long: document.getElementById('long-table').querySelector('tbody'),
    short: document.getElementById('short-table').querySelector('tbody')
  };
  
  tables.long.innerHTML = '';
  tables.short.innerHTML = '';
  
  for (const stock of STOCKS.longTerm) {
    const data = await fetchStockData(stock.symbol);
    tables.long.appendChild(createStockRow(stock, data));
  }
  
  for (const stock of STOCKS.shortTerm) {
    const data = await fetchStockData(stock.symbol);
    tables.short.appendChild(createStockRow(stock, data));
  }
}

// Event listeners
document.getElementById('refresh').addEventListener('click', updateStocks);
document.getElementById('retry').addEventListener('click', updateStocks);

// Initial load
updateStocks();