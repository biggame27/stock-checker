import { NextRequest, NextResponse } from 'next/server';
import yahooFinance from 'yahoo-finance2';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get('symbol');

    if (!symbol) {
      return NextResponse.json(
        { error: 'Stock symbol is required' },
        { status: 400 }
      );
    }

    // Fetch stock quote data
    const quote = await yahooFinance.quote(symbol);
    
    // Fetch additional stock information
    const result = await yahooFinance.quoteSummary(symbol, { 
      modules: ['price', 'summaryDetail', 'defaultKeyStatistics', 'financialData'] 
    });

    const stockData = {
      symbol: quote.symbol,
      shortName: quote.shortName,
      longName: quote.longName,
      regularMarketPrice: quote.regularMarketPrice,
      regularMarketChange: quote.regularMarketChange,
      regularMarketChangePercent: quote.regularMarketChangePercent,
      regularMarketTime: quote.regularMarketTime,
      marketCap: (result.defaultKeyStatistics as any)?.marketCap,
      volume: quote.regularMarketVolume,
      averageVolume: (result.summaryDetail as any)?.averageVolume,
      dayHigh: quote.regularMarketDayHigh,
      dayLow: quote.regularMarketDayLow,
      fiftyTwoWeekHigh: (result.summaryDetail as any)?.fiftyTwoWeekHigh,
      fiftyTwoWeekLow: (result.summaryDetail as any)?.fiftyTwoWeekLow,
      peRatio: (result.defaultKeyStatistics as any)?.trailingPE,
      forwardPE: result.defaultKeyStatistics?.forwardPE,
      eps: result.defaultKeyStatistics?.trailingEps,
      dividendYield: (result.summaryDetail as any)?.dividendYield,
      currency: quote.currency,
      exchange: quote.exchange,
    };

    return NextResponse.json(stockData);
  } catch (error) {
    console.error('Error fetching stock data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stock data' },
      { status: 500 }
    );
  }
}
