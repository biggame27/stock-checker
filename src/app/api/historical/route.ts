import { NextRequest, NextResponse } from 'next/server';
import yahooFinance from 'yahoo-finance2';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get('symbol');
    const period = searchParams.get('period') || '1mo'; // Default to 1 month

    if (!symbol) {
      return NextResponse.json(
        { error: 'Stock symbol is required' },
        { status: 400 }
      );
    }

    // Validate period parameter
    const validPeriods = ['1d', '5d', '1mo', '3mo', '6mo', '1y', '2y', '5y', '10y', 'ytd', 'max'];
    if (!validPeriods.includes(period)) {
      return NextResponse.json(
        { error: 'Invalid period. Valid periods: 1d, 5d, 1mo, 3mo, 6mo, 1y, 2y, 5y, 10y, ytd, max' },
        { status: 400 }
      );
    }

    // Calculate date range based on period
    const now = new Date();
    let period1: Date;
    
    switch (period) {
      case '1d':
        period1 = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000); // 2 days ago
        break;
      case '5d':
        period1 = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000); // 7 days ago
        break;
      case '1mo':
        period1 = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000); // 30 days ago
        break;
      case '3mo':
        period1 = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000); // 90 days ago
        break;
      case '6mo':
        period1 = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000); // 180 days ago
        break;
      case '1y':
        period1 = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000); // 1 year ago
        break;
      case '2y':
        period1 = new Date(now.getTime() - 730 * 24 * 60 * 60 * 1000); // 2 years ago
        break;
      case '5y':
        period1 = new Date(now.getTime() - 1825 * 24 * 60 * 60 * 1000); // 5 years ago
        break;
      default:
        period1 = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000); // Default to 30 days
    }

    // Fetch historical data with fallback approach
    let historicalData;
    try {
      // Try with specific date range first
      historicalData = await yahooFinance.historical(symbol, {
        period1,
        period2: now,
        interval: period === '1d' ? '5m' : period === '5d' ? '15m' : '1d',
      });
    } catch (firstError) {
      console.log('First attempt failed, trying with period string:', firstError);
      try {
        // Fallback: try with period string instead of dates
        const periodMap: { [key: string]: string } = {
          '1d': '1d',
          '5d': '5d', 
          '1mo': '1mo',
          '3mo': '3mo',
          '6mo': '6mo',
          '1y': '1y',
          '2y': '2y',
          '5y': '5y'
        };
        
        historicalData = await yahooFinance.historical(symbol, {
          period: periodMap[period] || '1mo',
          interval: period === '1d' ? '5m' : period === '5d' ? '15m' : '1d',
        });
      } catch (secondError) {
        console.log('Second attempt failed, trying basic approach:', secondError);
        // Final fallback: basic historical data
        historicalData = await yahooFinance.historical(symbol);
      }
    }

    // Format the data for the chart
    const chartData = historicalData.map(item => ({
      date: item.date,
      open: item.open,
      high: item.high,
      low: item.low,
      close: item.close,
      volume: item.volume,
    }));

    // Get current quote for comparison
    const quote = await yahooFinance.quote(symbol);

    return NextResponse.json({
      symbol,
      period,
      data: chartData,
      currentPrice: quote.regularMarketPrice,
      change: quote.regularMarketChange,
      changePercent: quote.regularMarketChangePercent,
    });
  } catch (error) {
    console.error('Error fetching historical data:', error);
    console.error('Symbol:', symbol, 'Period:', period);
    
    // Return more specific error information
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      { 
        error: 'Failed to fetch historical data',
        details: errorMessage,
        symbol,
        period
      },
      { status: 500 }
    );
  }
}
