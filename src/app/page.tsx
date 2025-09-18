'use client';

import { useState } from 'react';
import { TrendingUp, AlertCircle } from 'lucide-react';
import StockSearch from '@/components/StockSearch';
import StockCard from '@/components/StockCard';
import StockChart from '@/components/StockChart';
import { StockData } from '@/types/stock';

export default function Home() {
  const [selectedStock, setSelectedStock] = useState<StockData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStockSelect = async (symbol: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/stock?symbol=${encodeURIComponent(symbol)}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch stock data');
      }
      
      setSelectedStock(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setSelectedStock(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-center space-x-3">
            <TrendingUp className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Stock Checker</h1>
          </div>
          <p className="text-center text-gray-600 mt-2">
            Real-time stock market data powered by Yahoo Finance
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Section */}
        <div className="text-center mb-8">
          <StockSearch onStockSelect={handleStockSelect} />
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Loading stock data...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="max-w-md mx-auto">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-3">
              <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Stock Data Display */}
        {selectedStock && !isLoading && (
          <div className="max-w-6xl mx-auto space-y-6">
            <StockCard stock={selectedStock} />
            <StockChart symbol={selectedStock.symbol} />
          </div>
        )}

        {/* Welcome Message */}
        {!selectedStock && !isLoading && !error && (
          <div className="text-center py-12">
            <TrendingUp className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Welcome to Stock Checker
            </h2>
            <p className="text-gray-600 max-w-md mx-auto">
              Search for any stock symbol to get real-time market data, including price, 
              volume, market cap, and more detailed financial information.
            </p>
            <div className="mt-6 text-sm text-gray-500">
              <p>Try searching for popular stocks like:</p>
              <div className="flex justify-center space-x-4 mt-2">
                {['AAPL', 'TSLA', 'MSFT', 'GOOGL', 'AMZN'].map((symbol) => (
                  <button
                    key={symbol}
                    onClick={() => handleStockSelect(symbol)}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors"
                  >
                    {symbol}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-gray-500 text-sm">
            <p>Data provided by Yahoo Finance API</p>
            <p className="mt-1">This application is for educational purposes only</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
