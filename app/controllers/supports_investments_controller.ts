import { DateTime } from 'luxon'
import InvestmentSupport from '#models/investment_support'
import { getCurrentPrice, searchSymbols } from '#services/prix_investissement_service'
import { storeInvestmentSupportValidator } from '#validators/investment_support'
import type { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'
import { ValidationError } from '@vinejs/vine'

const searchValidator = vine.compile(
  vine.object({
    q: vine.string().trim().minLength(2).maxLength(100),
  })
)

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

    return inertia.render('investments/index', {
      supports: dtos,
      summary: { totalValue },
    })
  }

  async store({ request, response, auth, session }: HttpContext) {
    const user = auth.user!
    const payload = await request.validateUsing(storeInvestmentSupportValidator)

    let lastKnownPrice: number | null = null
    let lastPriceAt: DateTime | null = null

    try {
      const live = await getCurrentPrice(payload.symbol)
      if (live !== null) {
        lastKnownPrice = live
        lastPriceAt = DateTime.now()
      }
    } catch {
      // Ignore price fetch errors - will be handled by frontend with stale badge
    }

    await InvestmentSupport.create({
      ...payload,
      annualFees: payload.annualFees ?? 0,
      userId: user.id,
      lastKnownPrice,
      lastPriceAt,
    })

    session.flash('success', 'Support ajouté')
    response.redirect().toRoute('investissements')
  }

  async search({ request, response }: HttpContext) {
    // const user = auth.user!
    try {
      const { q } = await request.validateUsing(searchValidator)
      const results = await searchSymbols(q)
      return response.json({ results })
    } catch (error) {
      if (error instanceof ValidationError) {
        return response.status(422).json({ errors: error.messages })
      }
      throw error
    }
  }
}
