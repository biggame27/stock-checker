'use client';

import { useState, useEffect } from 'react';
import { Search, TrendingUp } from 'lucide-react';
import { StockSearchResult } from '@/types/stock';

interface StockSearchProps {
  onStockSelect: (symbol: string) => void;
}

export default function StockSearch({ onStockSelect }: StockSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<StockSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    const searchStocks = async () => {
      if (query.length < 2) {
        setResults([]);
        setShowResults(false);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await response.json();
        setResults(data.stocks || []);
        setShowResults(true);
      } catch (error) {
        console.error('Error searching stocks:', error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(searchStocks, 300);
    return () => clearTimeout(debounceTimer);
  }, [query]);

  const handleStockSelect = (stock: StockSearchResult) => {
    onStockSelect(stock.symbol);
    setQuery(stock.symbol);
    setShowResults(false);
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setShowResults(true)}
          placeholder="Search for stocks (e.g., AAPL, TSLA, MSFT)"
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
          </div>
        )}
      </div>

      {showResults && results.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {results.map((stock, index) => (
            <div
              key={index}
              onClick={() => handleStockSelect(stock)}
              className="flex items-center justify-between p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
            >
              <div className="flex items-center space-x-3">
                <TrendingUp className="h-5 w-5 text-green-500" />
                <div>
                  <div className="font-semibold text-gray-900">{stock.symbol}</div>
                  <div className="text-sm text-gray-600">{stock.shortName}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">{stock.exchange}</div>
                <div className="text-xs text-gray-400">{stock.type}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showResults && query.length >= 2 && results.length === 0 && !isLoading && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-4 text-center text-gray-500">
          No stocks found for "{query}"
        </div>
      )}
    </div>
  );
}
