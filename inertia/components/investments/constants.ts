export type SearchResult = {
  exchange: string
  shortname: string
  quoteType: 'EQUITY' | 'ETF' | 'MUTUALFUND' | string
  symbol: string
  index: string
  score: number
  typeDispo: string
  longname: string
  exchDisp: string
  sector: string
  industry: string
  dispSecIndFlag: boolean
  isYahooFinance: boolean
}

export type InvestmentSupport = {
  id: number
  userId: number
  symbol: string
  name: string
  type: 'PEA' | 'AV' | 'CTO'
  storageLocation: string
  annualFees: number
  description: string | null
  externalLink: string | null
  lastKnownPrice: number | null
  lastPriceAt: string | null
  currentValue: number
  evolutionPct: number
  plValue: number
  stale: boolean
}

export type InvestmentsSummary = {
  totalValue: number
}
