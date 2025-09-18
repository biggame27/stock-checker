'use client';

import { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { TrendingUp, TrendingDown, Calendar } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface HistoricalData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface ChartData {
  symbol: string;
  period: string;
  data: HistoricalData[];
  currentPrice: number;
  change: number;
  changePercent: number;
}

interface StockChartProps {
  symbol: string;
}

const timeframes = [
  { label: '1D', value: '1d', description: '1 Day' },
  { label: '5D', value: '5d', description: '5 Days' },
  { label: '1M', value: '1mo', description: '1 Month' },
  { label: '3M', value: '3mo', description: '3 Months' },
  { label: '6M', value: '6mo', description: '6 Months' },
  { label: '1Y', value: '1y', description: '1 Year' },
  { label: '2Y', value: '2y', description: '2 Years' },
  { label: '5Y', value: '5y', description: '5 Years' },
];

export default function StockChart({ symbol }: StockChartProps) {
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState('1mo');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchChartData = async (timeframe: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/historical?symbol=${encodeURIComponent(symbol)}&period=${timeframe}`);
      const data = await response.json();
      
      if (!response.ok) {
        console.error('API Error:', data);
        throw new Error(data.details || data.error || 'Failed to fetch chart data');
      }
      
      if (!data.data || data.data.length === 0) {
        throw new Error('No historical data available for this period');
      }
      
      setChartData(data);
    } catch (err) {
      console.error('Chart data fetch error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while loading chart data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (symbol) {
      fetchChartData(selectedTimeframe);
    }
  }, [symbol, selectedTimeframe]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (selectedTimeframe === '1d' || selectedTimeframe === '5d') {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}`;
  };

  const getChartData = () => {
    if (!chartData) return null;

    const isPositive = chartData.change >= 0;
    const lineColor = isPositive ? '#10b981' : '#ef4444';
    const fillColor = isPositive ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)';

    return {
      labels: chartData.data.map(item => formatDate(item.date)),
      datasets: [
        {
          label: 'Price',
          data: chartData.data.map(item => item.close),
          borderColor: lineColor,
          backgroundColor: fillColor,
          borderWidth: 2,
          fill: true,
          tension: 0.1,
          pointRadius: 0,
          pointHoverRadius: 6,
          pointHoverBackgroundColor: lineColor,
          pointHoverBorderColor: '#fff',
          pointHoverBorderWidth: 2,
        },
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        callbacks: {
          label: function(context: any) {
            return `Price: ${formatPrice(context.parsed.y)}`;
          },
        },
      },
    },
    scales: {
      x: {
        display: true,
        grid: {
          display: false,
        },
        ticks: {
          maxTicksLimit: 8,
          color: '#6b7280',
        },
      },
      y: {
        display: true,
        position: 'right' as const,
        grid: {
          color: 'rgba(107, 114, 128, 0.1)',
        },
        ticks: {
          color: '#6b7280',
          callback: function(value: any) {
            return formatPrice(value);
          },
        },
      },
    },
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
  };

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <div className="text-center py-8">
          <div className="text-red-500 mb-2">Failed to load chart data</div>
          <div className="text-gray-600 text-sm mb-4">{error}</div>
          <button
            onClick={() => fetchChartData(selectedTimeframe)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100">
      {/* Chart Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Calendar className="h-5 w-5 text-gray-500" />
            <h3 className="text-lg font-semibold text-gray-900">Price Chart</h3>
          </div>
          {chartData && (
            <div className="flex items-center space-x-2">
              {chartData.change >= 0 ? (
                <TrendingUp className="h-4 w-4 text-green-500" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500" />
              )}
              <span className={`font-semibold ${chartData.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {chartData.change >= 0 ? '+' : ''}{formatPrice(chartData.change)} ({chartData.changePercent.toFixed(2)}%)
              </span>
            </div>
          )}
        </div>

        {/* Timeframe Selector */}
        <div className="flex flex-wrap gap-2">
          {timeframes.map((timeframe) => (
            <button
              key={timeframe.value}
              onClick={() => setSelectedTimeframe(timeframe.value)}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                selectedTimeframe === timeframe.value
                  ? 'bg-blue-100 text-blue-700 border border-blue-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200'
              }`}
              title={timeframe.description}
            >
              {timeframe.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Content */}
      <div className="p-6">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Loading chart data...</span>
          </div>
        ) : chartData && getChartData() ? (
          <div className="h-64">
            <Line data={getChartData()!} options={chartOptions} />
          </div>
        ) : (
          <div className="flex justify-center items-center h-64 text-gray-500">
            No chart data available
          </div>
        )}
      </div>

      {/* Chart Footer */}
      {chartData && (
        <div className="px-6 py-4 bg-gray-50 rounded-b-xl">
          <div className="flex justify-between items-center text-sm text-gray-600">
            <span>Current Price: <span className="font-semibold text-gray-900">{formatPrice(chartData.currentPrice)}</span></span>
            <span>Period: {timeframes.find(t => t.value === selectedTimeframe)?.description}</span>
          </div>
        </div>
      )}
    </div>
  );
}
