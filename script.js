// script.js - Production Ready
document.addEventListener('DOMContentLoaded', function() {
  // DOM Elements
  const elements = {
    longTableBody: document.querySelector('#long-table tbody'),
    shortTableBody: document.querySelector('#short-table tbody'),
    refreshBtn: document.getElementById('refresh'),
    loadingEl: document.getElementById('loading'),
    errorEl: document.getElementById('error'),
    errorMsg: document.querySelector('.error-message'),
    statusEl: document.getElementById('status'),
    retryBtn: document.getElementById('retry'),
    tabLong: document.getElementById('tab-long'),
    tabShort: document.getElementById('tab-short'),
    longSection: document.getElementById('long-section'),
    shortSection: document.getElementById('short-section')
  };

  // Tab switching
  elements.tabLong.addEventListener('click', () => {
    elements.longSection.classList.remove('hidden');
    elements.shortSection.classList.add('hidden');
    elements.tabLong.classList.add('active');
    elements.tabShort.classList.remove('active');
  });

  elements.tabShort.addEventListener('click', () => {
    elements.shortSection.classList.remove('hidden');
    elements.longSection.classList.add('hidden');
    elements.tabShort.classList.add('active');
    elements.tabLong.classList.remove('active');
  });

  // Fetch stock data with timeout
  async function fetchStockData(symbol) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), CONFIG.api.yahooFinance.timeout);
    
    try {
      elements.loadingEl.classList.remove('hidden');
      const response = await fetch(
        `${CONFIG.api.yahooFinance.baseUrl}/${symbol}?region=${CONFIG.api.yahooFinance.region}`,
        { signal: controller.signal }
      );
      
      clearTimeout(timeoutId);
      
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const data = await response.json();
      
      if (!data.chart?.result?.[0]?.meta) {
        throw new Error('Invalid data format from API');
      }
      
      const { regularMarketPrice, chartPreviousClose } = data.chart.result[0].meta;
      const changePercent = ((regularMarketPrice - chartPreviousClose) / chartPreviousClose * 100).toFixed(2);
      
      return {
        price: regularMarketPrice.toFixed(CONFIG.display.decimalPlaces),
        change: changePercent,
        rawPrice: regularMarketPrice
      };
    } catch (error) {
      console.error(`Error fetching ${symbol}:`, error);
      if (CONFIG.fallbackData && CONFIG.fallbackData[symbol]) {
        return {
          price: CONFIG.fallbackData[symbol].price.toFixed(CONFIG.display.decimalPlaces),
          change: CONFIG.fallbackData[symbol].changePercent,
          isFallback: true
        };
      }
      throw error;
    } finally {
      clearTimeout(timeoutId);
      elements.loadingEl.classList.add('hidden');
    }
  }

  // Create table row
  function createStockRow(stock, data) {
    const row = document.createElement('tr');
    if (data?.isFallback) row.style.opacity = '0.7';
    
    const symbolCell = document.createElement('td');
    symbolCell.textContent = stock.symbol.replace('.NS', '');
    row.appendChild(symbolCell);
    
    const priceCell = document.createElement('td');
    priceCell.textContent = data ? 
      `${CONFIG.display.currency.symbol}${data.price}` : 'ERR';
    row.appendChild(priceCell);
    
    const changeCell = document.createElement('td');
    changeCell.textContent = data ? `${data.change}%` : 'N/A';
    changeCell.style.color = parseFloat(data?.change) >= 0 ? '#28a745' : '#dc3545';
    row.appendChild(changeCell);
    
    const notesCell = document.createElement('td');
    notesCell.textContent = stock.notes;
    row.appendChild(notesCell);
    
    return row;
  }

  // Update all stocks
  async function updateStocks() {
    try {
      elements.errorEl.classList.add('hidden');
      elements.statusEl.textContent = 'Loading data...';
      elements.statusEl.style.color = '#6c757d';
      
      // Clear tables
      elements.longTableBody.innerHTML = '';
      elements.shortTableBody.innerHTML = '';
      
      // Process long term stocks
      for (const stock of CONFIG.stocks.longTerm) {
        const data = await fetchStockData(stock.symbol);
        elements.longTableBody.appendChild(createStockRow(stock, data));
      }
      
      // Process short term stocks
      for (const stock of CONFIG.stocks.shortTerm) {
        const data = await fetchStockData(stock.symbol);
        elements.shortTableBody.appendChild(createStockRow(stock, data));
      }
      
      elements.statusEl.textContent = `Last updated: ${new Date().toLocaleTimeString('en-IN')}`;
      elements.statusEl.style.color = '#28a745';
    } catch (error) {
      elements.errorMsg.textContent = `Error: ${error.message}`;
      elements.errorEl.classList.remove('hidden');
      elements.statusEl.textContent = 'Update failed';
      elements.statusEl.style.color = '#dc3545';
    }
  }

  // Event listeners
  elements.refreshBtn.addEventListener('click', updateStocks);
  elements.retryBtn.addEventListener('click', updateStocks);

  // Initial load
  updateStocks();
});