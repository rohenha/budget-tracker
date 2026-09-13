import { DateTime } from 'luxon'
import InvestmentSupport from '#models/investment_support'
import { getCurrentPrice } from '#services/prix_investissement_service'
import type { HttpContext } from '@adonisjs/core/http'

export default class SupportsInvestissementController {
  async index({ inertia, auth }: HttpContext) {
    const user = auth.user!
    const supports = await InvestmentSupport.query().where('userId', user.id)

    const dtos = await Promise.all(
      supports.map(async (support) => {
        let price = support.lastKnownPrice ? Number(support.lastKnownPrice) : null
        let stale = false

        try {
          const live = await getCurrentPrice(support.symbol)
          if (live !== null) {
            price = live
            support.lastKnownPrice = live
            support.lastPriceAt = DateTime.now()
            await support.save().catch(() => {})
          } else if (price !== null) {
            stale = true
          } else {
            stale = true
          }
        } catch {
          stale = price !== null ? true : true
        }

        const currentValue = 0
        const evolutionPct = 0
        const plValue = 0

        return {
          id: support.id,
          userId: support.userId,
          symbol: support.symbol,
          name: support.name,
          type: support.type,
          storageLocation: support.storageLocation,
          annualFees: Number(support.annualFees ?? 0),
          description: support.description,
          externalLink: support.externalLink,
          lastKnownPrice: price,
          lastPriceAt: support.lastPriceAt?.toISO() ?? null,
          currentValue,
          evolutionPct,
          plValue,
          stale,
        }
      })
    )

    const totalValue = dtos.reduce((sum, s) => sum + s.currentValue, 0)

    return inertia.render('investissements/index', {
      supports: dtos,
      summary: { totalValue },
    })
  }
}
