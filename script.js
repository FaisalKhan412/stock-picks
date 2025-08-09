// [Previous DOM elements and tab switching code remains the same]

let usdToInrRate = 75.00; // Default fallback rate

// Fetch USD to INR conversion rate
async function fetchExchangeRate() {
  try {
    const url = `${API_CONFIG.baseUrl}?function=${API_CONFIG.forexFunction}&from_currency=${API_CONFIG.fromCurrency}&to_currency=${API_CONFIG.toCurrency}&apikey=${API_CONFIG.apiKey}`;
    const response = await fetch(url);
    
    if (!response.ok) throw new Error('Network response was not ok');
    
    const data = await response.json();
    
    if (data['Error Message'] || data['Note']) {
      throw new Error(data['Error Message'] || data['Note']);
    }
    
    const rate = parseFloat(data['Realtime Currency Exchange Rate']['5. Exchange Rate']);
    return rate || usdToInrRate;
  } catch (error) {
    console.error('Error fetching exchange rate:', error);
    return usdToInrRate; // Return default rate if API fails
  }
}

// Fetch stock data (updated for INR conversion)
async function fetchStockData(symbol) {
  try {
    const url = `${API_CONFIG.baseUrl}?function=${API_CONFIG.stockFunction}&symbol=${symbol}&apikey=${API_CONFIG.apiKey}`;
    const response = await fetch(url);
    
    if (!response.ok) throw new Error('Network response was not ok');
    
    const data = await response.json();
    
    if (data['Error Message'] || data['Note']) {
      throw new Error(data['Error Message'] || data['Note']);
    }
    
    return data['Global Quote'] || null;
  } catch (error) {
    console.error('Error fetching data for', symbol, error);
    throw error;
  }
}

// Update table with stock data (now in INR)
async function updateStocks() {
  loadingEl.classList.remove('hidden');
  errorEl.classList.add('hidden');
  statusEl.textContent = '';
  
  try {
    // First get current exchange rate
    usdToInrRate = await fetchExchangeRate();
    
    // Clear tables
    longTable.innerHTML = '';
    shortTable.innerHTML = '';
    
    // Process long term stocks
    for (const stock of STOCKS.longTerm) {
      const quote = await fetchStockData(stock.symbol);
      const row = createStockRow(stock, quote, usdToInrRate);
      longTable.appendChild(row);
    }
    
    // Process short term stocks
    for (const stock of STOCKS.shortTerm) {
      const quote = await fetchStockData(stock.symbol);
      const row = createStockRow(stock, quote, usdToInrRate);
      shortTable.appendChild(row);
    }
    
    statusEl.textContent = `Last updated: ${new Date().toLocaleTimeString()} | 1 USD = ${usdToInrRate.toFixed(2)} INR`;
  } catch (error) {
    errorMsg.textContent = `Error: ${error.message || 'Failed to load stock data'}`;
    errorEl.classList.remove('hidden');
  } finally {
    loadingEl.classList.add('hidden');
  }
}

// Helper function to create table row (updated for INR)
function createStockRow(stock, quote, conversionRate) {
  const row = document.createElement('tr');
  
  const symbolCell = document.createElement('td');
  symbolCell.textContent = stock.symbol.replace('.BO', '');
  row.appendChild(symbolCell);
  
  const priceCell = document.createElement('td');
  if (quote) {
    const usdPrice = parseFloat(quote['05. price']);
    const inrPrice = (usdPrice * conversionRate).toFixed(2);
    priceCell.textContent = `₹${inrPrice}`;
  } else {
    priceCell.textContent = 'ERR';
  }
  row.appendChild(priceCell);
  
  const changeCell = document.createElement('td');
  if (quote) {
    const changePercent = quote['10. change percent'];
    changeCell.textContent = changePercent;
    changeCell.style.color = changePercent.startsWith('-') ? 'red' : 'green';
  } else {
    changeCell.textContent = 'No data';
    changeCell.style.color = 'gray';
  }
  row.appendChild(changeCell);
  
  const notesCell = document.createElement('td');
  notesCell.textContent = stock.notes;
  row.appendChild(notesCell);
  
  return row;
}

// [Rest of the event listeners and initial load remain the same]