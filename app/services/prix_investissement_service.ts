import YahooFinance from 'yahoo-finance2'
import type { SearchResult } from '~/components/investments/constants.ts'

const yahooFinance = new YahooFinance({
  queue: { concurrency: 2, interval: 250 },
  suppressNotices: ['yahooSurvey'],
})

export async function getCurrentPrice(symbol: string): Promise<number | null> {
  const trimmed = symbol?.trim()
  if (!trimmed) return null
  try {
    const quote = (await Promise.race([
      yahooFinance.quote(trimmed),
      new Promise<null>((resolve) => setTimeout(() => resolve(null), 5000)),
    ])) as { regularMarketPrice?: number | null } | null
    const price = quote?.regularMarketPrice
    if (typeof price !== 'number' || !Number.isFinite(price) || price <= 0) return null
    return price
  } catch {
    return null
  }
}

export async function searchSymbols(query: string): Promise<SearchResult[]> {
  const trimmed = query?.trim()
  if (!trimmed || trimmed.length < 2) return []
  try {
    const results = await Promise.race([
      yahooFinance.search(trimmed),
      new Promise<{ quotes: SearchResult[] } | null>((resolve) =>
        setTimeout(() => resolve(null), 5000)
      ),
    ])
    if (!results?.quotes) return []
    const filtered = results.quotes.filter(
      (q): q is SearchResult => !!q.symbol && (!!q.shortname || !!q.longname)
    )
    return filtered
  } catch {
    return []
  }
}
