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
