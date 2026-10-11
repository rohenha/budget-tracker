import YahooFinance from 'yahoo-finance2'
import type { SearchResult } from '../../inertia/components/investments/constants.ts'

type YahooFinanceInstance = InstanceType<typeof YahooFinance>

let yahooFinanceInstance: YahooFinanceInstance | null = null

function getYahooFinance(): YahooFinanceInstance {
  if (!yahooFinanceInstance) {
    yahooFinanceInstance = new YahooFinance({
      queue: { concurrency: 10, interval: 100 },
      suppressNotices: ['yahooSurvey'],
    })
  }
  return yahooFinanceInstance
}

export function setYahooFinanceForTesting(instance: YahooFinanceInstance): void {
  yahooFinanceInstance = instance
}

export async function getCurrentPrice(symbol: string): Promise<number | null> {
  const trimmed = symbol?.trim()
  if (!trimmed) return null

  const yf = getYahooFinance()
  try {
    const quote = await yf.quote(trimmed)
    const price = quote?.regularMarketPrice ?? quote?.postMarketPrice ?? quote?.preMarketPrice
    if (typeof price !== 'number' || !Number.isFinite(price) || price <= 0) return null
    return price
  } catch {
    return null
  }
}

export async function searchSymbols(query: string): Promise<SearchResult[]> {
  const trimmed = query?.trim()
  if (!trimmed || trimmed.length < 2) return []

  const yf = getYahooFinance()
  try {
    const results = await yf.search(trimmed)
    if (!results?.quotes) return []
    return results.quotes
      .filter((q) => !!q.symbol && (!!q.shortname || !!q.longname))
      .map((q) => ({
        symbol: q.symbol!,
        shortname: q.shortname ?? '',
        longname: q.longname ?? '',
        exchange: q.exchange ?? '',
        quoteType: q.quoteType ?? '',
        index: q.index ?? '',
        score: q.score ?? 0,
        typeDisp: q.typeDisp ?? '',
        isYahooFinance: q.isYahooFinance ?? false,
      })) as SearchResult[]
  } catch {
    return []
  }
}
