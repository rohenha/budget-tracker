import { DateTime } from 'luxon'
import InvestmentSupport from '#models/investment_support'
import { getCurrentPrice, searchSymbols } from '#services/prix_investissement_service'
import {
  storeInvestmentSupportValidator,
  searchInvestmentSupportValidator,
  updateInvestmentSupportValidator,
} from '#validators/investment_support'
import type { HttpContext } from '@adonisjs/core/http'
import { ValidationError } from '@vinejs/vine'

const searchRateLimit = new Map<string, { count: number; resetAt: number }>()

function checkSearchRateLimit(identifier: string): boolean {
  const now = Date.now()
  const windowMs = 60_000 // 1 minute
  const maxRequests = 30 // 30 requests per minute

  const record = searchRateLimit.get(identifier)
  if (!record || now > record.resetAt) {
    searchRateLimit.set(identifier, { count: 1, resetAt: now + windowMs })
    return true
  }

  if (record.count >= maxRequests) {
    return false
  }

  record.count++
  return true
}

export default class SupportsInvestmentsController {
  async index({ inertia, auth, request }: HttpContext) {
    const user = auth.user!
    const page = request.input('page', 1)
    const limit = 50
    const supports = await InvestmentSupport.query()
      .where('userId', user.id)
      .orderBy('createdAt', 'desc')
      .paginate(page, limit)

    const dtos = await Promise.all(
      supports.all().map(async (support) => {
        let price = support.lastKnownPrice ? Number(support.lastKnownPrice) : null
        let stale = false

        try {
          const live = await getCurrentPrice(support.symbol)
          if (live !== null) {
            price = live
            support.lastKnownPrice = live
            support.lastPriceAt = DateTime.now()
            try {
              await support.save()
            } catch (saveError) {
              // Log error but don't block rendering - price update is best-effort
              console.error('Failed to update support price:', saveError)
            }
            stale = false
          } else {
            stale = true
          }
        } catch {
          stale = true
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

    const pagination = {
      currentPage: supports.currentPage,
      lastPage: supports.lastPage,
      perPage: supports.perPage,
      total: supports.total,
    }

    return inertia.render('investments/index', {
      supports: dtos,
      summary: { totalValue },
      pagination,
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

  async search({ request, response, auth }: HttpContext) {
    const identifier = auth.user?.id?.toString() ?? request.ip() ?? 'anonymous'
    if (!checkSearchRateLimit(identifier)) {
      return response.status(429).json({ error: 'Too many requests. Please slow down.' })
    }

    try {
      const { q } = await request.validateUsing(searchInvestmentSupportValidator)
      const results = await searchSymbols(q)
      return response.json({ results })
    } catch (error) {
      if (error instanceof ValidationError) {
        return response.status(422).json({ errors: error.messages })
      }
      throw error
    }
  }

  async update({ request, response, auth, session, params }: HttpContext) {
    const user = auth.user!
    const support = await InvestmentSupport.query()
      .where('id', params.id)
      .where('userId', user.id)
      .firstOrFail()

    const payload = await request.validateUsing(updateInvestmentSupportValidator)

    let lastKnownPrice: number | null = support.lastKnownPrice
    let lastPriceAt: DateTime | null = support.lastPriceAt

    if (payload.symbol && payload.symbol !== support.symbol) {
      try {
        const live = await getCurrentPrice(payload.symbol)
        if (live !== null) {
          lastKnownPrice = live
          lastPriceAt = DateTime.now()
        }
      } catch {
        // Ignore price fetch errors
      }
    }

    support.merge({
      ...payload,
      annualFees: payload.annualFees ?? support.annualFees,
      lastKnownPrice,
      lastPriceAt,
    })
    await support.save()

    session.flash('success', 'Support modifié')
    response.redirect().toRoute('investissements')
  }

  async destroy({ auth, session, response, params }: HttpContext) {
    const user = auth.user!
    const support = await InvestmentSupport.query()
      .where('id', params.id)
      .where('userId', user.id)
      .firstOrFail()

    await support.delete()

    session.flash('success', 'Support supprimé')
    response.redirect().toRoute('investissements')
  }
}
