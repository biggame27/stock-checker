export interface StockData {
  symbol: string;
  shortName: string;
  longName: string;
  regularMarketPrice: number;
  regularMarketChange: number;
  regularMarketChangePercent: number;
  regularMarketTime: number;
  marketCap?: number;
  volume: number;
  averageVolume?: number;
  dayHigh: number;
  dayLow: number;
  fiftyTwoWeekHigh?: number;
  fiftyTwoWeekLow?: number;
  peRatio?: number;
  forwardPE?: number;
  eps?: number;
  dividendYield?: number;
  currency: string;
  exchange: string;
}

export interface StockSearchResult {
  symbol: string;
  shortName: string;
  longName: string;
  exchange: string;
  type: string;
}

export interface SearchResponse {
  stocks: StockSearchResult[];
}
