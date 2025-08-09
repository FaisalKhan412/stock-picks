// script.js
const API_KEY = '6CUWCEKKTSLIXQ7L';

// Example stock lists
const longTermStocks = [
    { symbol: "RELIANCE.BSE", notes: "Strong fundamentals" },
    { symbol: "INFY.BSE", notes: "Consistent revenue growth" }
];

const shortTermStocks = [
    { symbol: "TCS.BSE", notes: "Bullish technicals" },
    { symbol: "HDFCBANK.BSE", notes: "Short-term momentum" }
];

// Fetch stock data from Alpha Vantage
async function fetchStockData(symbol) {
    try {
        const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${symbol}&apikey=${API_KEY}`;
        const response = await fetch(url);
        const data = await response.json();
        console.log(symbol, data); // Debugging

        // Error handling
        if (data['Error Message'] || !data['Time Series (Daily)']) {
            return { price: "ERR", change: "No data found" };
        }

        const dates = Object.keys(data['Time Series (Daily)']);
        const latestDate = dates[0];
        const prevDate = dates[1];

        const latestClose = parseFloat(data['Time Series (Daily)'][latestDate]['4. close']);
        const prevClose = parseFloat(data['Time Series (Daily)'][prevDate]['4. close']);

        const changePercent = (((latestClose - prevClose) / prevClose) * 100).toFixed(2);

        return {
            price: latestClose.toFixed(2),
            change: `${changePercent}%`
        };
    } catch (error) {
        console.error("Error fetching data for", symbol, error);
        return { price: "ERR", change: "No data found" };
    }
}

// Render stocks in the table
async function renderStocks(stocks) {
    const tableBody = document.getElementById("stock-table-body");
    tableBody.innerHTML = "";

    for (const stock of stocks) {
        const { price, change } = await fetchStockData(stock.symbol);

        const row = `
            <tr>
                <td>${stock.symbol}</td>
                <td>${price}</td>
                <td>${change}</td>
                <td>${stock.notes}</td>
            </tr>
        `;
        tableBody.innerHTML += row;

        // Avoid hitting API rate limit (5 requests/minute)
        await new Promise(resolve => setTimeout(resolve, 15000)); // 15 seconds delay
    }

    document.getElementById("last-updated").textContent = `Done at ${new Date().toLocaleTimeString()}`;
}

// Button events
document.getElementById("btn-long").addEventListener("click", () => renderStocks(longTermStocks));
document.getElementById("btn-short").addEventListener("click", () => renderStocks(shortTermStocks));
document.getElementById("btn-refresh").addEventListener("click", () => renderStocks(longTermStocks));

// Default load
renderStocks(longTermStocks);


