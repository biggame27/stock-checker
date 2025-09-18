'use client';

import { TrendingUp, TrendingDown, DollarSign, BarChart3, Clock, Globe } from 'lucide-react';
import { StockData } from '@/types/stock';

interface StockCardProps {
  stock: StockData;
}

export default function StockCard({ stock }: StockCardProps) {
  const isPositive = stock.regularMarketChange >= 0;
  const changeColor = isPositive ? 'text-green-600' : 'text-red-600';
  const changeBgColor = isPositive ? 'bg-green-50' : 'bg-red-50';

  const formatNumber = (num: number | undefined) => {
    if (num === undefined) return 'N/A';
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`;
    return `$${num.toFixed(2)}`;
  };

  const formatVolume = (num: number | undefined) => {
    if (num === undefined) return 'N/A';
    if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(2)}K`;
    return num.toString();
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{stock.symbol}</h2>
          <p className="text-gray-600">{stock.shortName}</p>
          {stock.longName && stock.longName !== stock.shortName && (
            <p className="text-sm text-gray-500 mt-1">{stock.longName}</p>
          )}
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-gray-900">
            {formatNumber(stock.regularMarketPrice)}
          </div>
          <div className={`flex items-center space-x-1 ${changeColor}`}>
            {isPositive ? (
              <TrendingUp className="h-4 w-4" />
            ) : (
              <TrendingDown className="h-4 w-4" />
            )}
            <span className="font-semibold">
              {isPositive ? '+' : ''}{formatNumber(stock.regularMarketChange)} ({stock.regularMarketChangePercent.toFixed(2)}%)
            </span>
          </div>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <DollarSign className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-600">Market Cap</span>
          </div>
          <div className="text-lg font-semibold text-gray-900">
            {formatNumber(stock.marketCap)}
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <BarChart3 className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-600">Volume</span>
          </div>
          <div className="text-lg font-semibold text-gray-900">
            {formatVolume(stock.volume)}
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <TrendingUp className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-600">P/E Ratio</span>
          </div>
          <div className="text-lg font-semibold text-gray-900">
            {stock.peRatio ? stock.peRatio.toFixed(2) : 'N/A'}
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Globe className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-600">Exchange</span>
          </div>
          <div className="text-lg font-semibold text-gray-900">
            {stock.exchange}
          </div>
        </div>
      </div>

      {/* Price Range */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-800 mb-2">Day Range</h3>
          <div className="text-lg font-semibold text-blue-900">
            {formatNumber(stock.dayLow)} - {formatNumber(stock.dayHigh)}
          </div>
        </div>

        <div className="bg-purple-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-purple-800 mb-2">52-Week Range</h3>
          <div className="text-lg font-semibold text-purple-900">
            {formatNumber(stock.fiftyTwoWeekLow)} - {formatNumber(stock.fiftyTwoWeekHigh)}
          </div>
        </div>
      </div>

      {/* Additional Info */}
      <div className="border-t border-gray-200 pt-4">
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4" />
            <span>Last updated: {formatDate(stock.regularMarketTime)}</span>
          </div>
          <div className="flex items-center space-x-4">
            {stock.eps && (
              <span>EPS: ${stock.eps.toFixed(2)}</span>
            )}
            {stock.dividendYield && (
              <span>Div Yield: {(stock.dividendYield * 100).toFixed(2)}%</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
