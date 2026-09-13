import YahooFinance from 'yahoo-finance2'

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
