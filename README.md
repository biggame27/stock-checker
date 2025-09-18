# Stock Checker

A modern web application for checking real-time stock market data using the Yahoo Finance API. Built with Next.js, TypeScript, and Tailwind CSS.

## Features

- 🔍 **Stock Search**: Search for stocks by symbol or company name
- 📊 **Real-time Data**: Get current stock prices, volume, and market data
- 📈 **Detailed Information**: View market cap, P/E ratio, 52-week highs/lows, and more
- 🎨 **Modern UI**: Clean, responsive design with Tailwind CSS
- ⚡ **Fast Performance**: Built with Next.js for optimal performance

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd stock-checker
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. **Search for Stocks**: Use the search bar to find stocks by symbol (e.g., AAPL, TSLA, MSFT) or company name
2. **View Stock Data**: Click on any search result to view detailed stock information
3. **Quick Access**: Use the popular stock buttons for quick access to major stocks

## API Endpoints

- `GET /api/stock?symbol=<SYMBOL>` - Get detailed stock information
- `GET /api/search?q=<QUERY>` - Search for stocks

## Technologies Used

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Yahoo Finance API** - Real-time stock market data
- **Lucide React** - Beautiful icons

## Data Source

This application uses the Yahoo Finance API through the `yahoo-finance2` npm package to fetch real-time stock market data. The data includes:

- Current stock price and change
- Market capitalization
- Trading volume
- P/E ratio and other financial metrics
- 52-week high/low prices
- Dividend yield information

## Disclaimer

This application is for educational purposes only. The stock data provided is for informational purposes and should not be considered as financial advice. Always consult with a qualified financial advisor before making investment decisions.

## License

MIT License - feel free to use this project for learning and development purposes.