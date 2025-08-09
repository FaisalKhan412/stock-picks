const API_KEY = (window.ALPHA_VANTAGE_API_KEY || "").trim();

const longTerm = [
  { symbol: "RELIANCE.BSE", notes: "Strong fundamentals" },
  { symbol: "INFY.BSE", notes: "Consistent revenue growth" }
];

const shortTerm = [
  { symbol: "TCS.BSE", notes: "Breakout watch" },
  { symbol: "HDFC.BSE", notes: "Momentum play" }
];

const RATE_LIMIT_MS = 12000; // 5 requests/minute on free tier

const statusEl = document.getElementById('status');
const longTableBody = document.querySelector('#long-table tbody');
const shortTableBody = document.querySelector('#short-table tbody');

function setStatus(msg) {
  statusEl.textContent = msg;
}

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function fetchGlobalQuote(symbol) {
  const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${encodeURIComponent(symbol)}&apikey=${API_KEY}`;
  try {
    const res = await fetch(url);
    const json = await res.json();
    if (json.Note) throw new Error("API limit reached. Wait and try again.");
    const g = json["Global Quote"];
    if (!g || Object.keys(g).length === 0) throw new Error("No data found");
    return {
      symbol: g["01. symbol"] || symbol,
      price: g["05. price"] || "N/A",
      changePercent: g["10. change percent"] || "N/A"
    };
  } catch (err) {
    return { symbol, price: "ERR", changePercent: err.message };
  }
}

async function populateTable(list, tbody) {
  tbody.innerHTML = "";
  setStatus("Fetching data...");
  for (let i = 0; i < list.length; i++) {
    setStatus(`Fetching ${list[i].symbol} (${i + 1}/${list.length})...`);
    const q = await fetchGlobalQuote(list[i].symbol);
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${q.symbol}</td><td>${q.price}</td><td>${q.changePercent}</td><td>${list[i].notes}</td>`;
    tbody.appendChild(tr);
    if (i < list.length - 1) await sleep(RATE_LIMIT_MS);
  }
  setStatus("Done at " + new Date().toLocaleTimeString());
}

document.getElementById('tab-long').addEventListener('click', () => {
  document.getElementById('long-section').classList.remove('hidden');
  document.getElementById('short-section').classList.add('hidden');
  document.getElementById('tab-long').classList.add('active');
  document.getElementById('tab-short').classList.remove('active');
});
document.getElementById('tab-short').addEventListener('click', () => {
  document.getElementById('short-section').classList.remove('hidden');
  document.getElementById('long-section').classList.add('hidden');
  document.getElementById('tab-short').classList.add('active');
  document.getElementById('tab-long').classList.remove('active');
});
document.getElementById('refresh').addEventListener('click', refreshAll);

async function refreshAll() {
  await populateTable(longTerm, longTableBody);
  await populateTable(shortTerm, shortTableBody);
}

refreshAll();

