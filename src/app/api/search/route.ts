import { NextRequest, NextResponse } from 'next/server';
import yahooFinance from 'yahoo-finance2';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query) {
      return NextResponse.json(
        { error: 'Search query is required' },
        { status: 400 }
      );
    }

    // Search for stocks using Yahoo Finance search
    const searchResults = await yahooFinance.search(query, {
      newsCount: 0,
      quotesCount: 10,
    });

    const stocks = searchResults.quotes
      ?.filter((quote: any) => quote.symbol && quote.shortname)
      .map((quote: any) => ({
        symbol: quote.symbol,
        shortName: quote.shortname,
        longName: quote.longname,
        exchange: quote.exchange,
        type: quote.typeDisp,
      })) || [];

    return NextResponse.json({ stocks });
  } catch (error) {
    console.error('Error searching stocks:', error);
    return NextResponse.json(
      { error: 'Failed to search stocks' },
      { status: 500 }
    );
  }
}
