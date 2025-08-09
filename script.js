// script.js — paste entire file (REPLACE existing)
document.addEventListener('DOMContentLoaded', () => {
  const API_KEY = (window.ALPHA_VANTAGE_API_KEY || "").trim();

  const longTerm = [
    { symbol: "RELIANCE.BSE", notes: "Strong fundamentals" },
    { symbol: "INFY.BSE", notes: "Consistent revenue growth" }
  ];

  const shortTerm = [
    { symbol: "TCS.BSE", notes: "Breakout watch" },
    { symbol: "HDFCBANK.BSE", notes: "Short-term momentum" }
  ];

  const RATE_LIMIT_MS = 12000; // 12 seconds per request to respect free tier

  const statusEl = document.getElementById('status');
  const longTableBody = document.querySelector('#long-table tbody');
  const shortTableBody = document.querySelector('#short-table tbody');

  function setStatus(msg){
    if (statusEl) statusEl.textContent = msg;
    console.log('[status]', msg);
  }

  async function sleep(ms){ return new Promise(r => setTimeout(r, ms)); }

  async function fetchDailyAdjusted(symbol){
    if (!API_KEY) {
      console.error('API key not found. Make sure config.js or config.example.js is loaded.');
      return { symbol, price: "ERR", change: "No API key" };
    }
    const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${encodeURIComponent(symbol)}&apikey=${API_KEY}`;
    try {
      const res = await fetch(url);
      const json = await res.json();
      console.log('AV response for', symbol, json);

      if (json.Note) {
        return { symbol, price: "ERR", change: "Rate limit: " + (json.Note || "wait") };
      }
      if (json['Error Message'] || !json['Time Series (Daily)']) {
        return { symbol, price: "ERR", change: "No data found" };
      }

      const ts = json['Time Series (Daily)'];
      const dates = Object.keys(ts);
      if (dates.length < 2) return { symbol, price: "ERR", change: "Insufficient data" };

      const latest = ts[dates[0]];
      const prev = ts[dates[1]];
      const latestClose = parseFloat(latest['4. close']);
      const prevClose = parseFloat(prev['4. close']);
      const changePct = (((latestClose - prevClose) / prevClose) * 100).toFixed(2);

      return {
        symbol,
        price: latestClose.toFixed(2),
        change: changePct + '%'
      };
    } catch (err) {
      console.error('Fetch error for', symbol, err);
      return { symbol, price: "ERR", change: "Fetch error" };
    }
  }

  async function populateTable(list, tbody){
    if (!tbody) return;
    tbody.innerHTML = "";
    setStatus(`Fetching ${list.length} symbols...`);
    for (let i = 0; i < list.length; i++){
      const item = list[i];
      setStatus(`Fetching ${item.symbol} (${i+1}/${list.length})...`);
      const q = await fetchDailyAdjusted(item.symbol);
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${q.symbol}</td><td>${q.price}</td><td>${q.change}</td><td>${item.notes||''}</td>`;
      tbody.appendChild(tr);
      if (i < list.length - 1) await sleep(RATE_LIMIT_MS);
    }
    setStatus("Done at " + new Date().toLocaleTimeString());
  }

  // UI: tabs and refresh (IDs must match those in your index.html)
  const btnLong = document.getElementById('tab-long');
  const btnShort = document.getElementById('tab-short');
  const btnRefresh = document.getElementById('refresh');

  if (btnLong) btnLong.addEventListener('click', () => {
    document.getElementById('long-section').classList.remove('hidden');
    document.getElementById('short-section').classList.add('hidden');
    btnLong.classList.add('active');
    btnShort.classList.remove('active');
  });

  if (btnShort) btnShort.addEventListener('click', () => {
    document.getElementById('short-section').classList.remove('hidden');
    document.getElementById('long-section').classList.add('hidden');
    btnShort.classList.add('active');
    btnLong.classList.remove('active');
  });

  if (btnRefresh) btnRefresh.addEventListener('click', async () => {
    const shortHidden = document.getElementById('short-section').classList.contains('hidden');
    if (!shortHidden) {
      await populateTable(shortTerm, shortTableBody);
    } else {
      await populateTable(longTerm, longTableBody);
    }
  });

  // initial load: long-term table
  populateTable(longTerm, longTableBody);
});
