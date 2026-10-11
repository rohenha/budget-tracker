import InvestmentSupport from '#models/investment_support'
import InvestmentTransaction from '#models/investment_transaction'
import {
  storeInvestmentTransactionValidator,
  updateInvestmentTransactionValidator,
} from '#validators/investment_support'
import type { HttpContext } from '@adonisjs/core/http'

export default class InvestmentTransactionsController {
  async index({ inertia, auth, params, request }: HttpContext) {
    const user = auth.user!
    const support = await InvestmentSupport.query()
      .where('id', params.id)
      .where('userId', user.id)
      .firstOrFail()

    const page = request.input('page', 1)
    const limit = 50

    const transactions = await InvestmentTransaction.query()
      .where('supportId', support.id)
      .orderBy('date', 'desc')
      .orderBy('createdAt', 'desc')
      .paginate(page, limit)

    const dtos = transactions.all().map((t) => ({
      id: t.id,
      supportId: t.supportId,
      type: t.type,
      date: t.date.toISODate(),
      quantity: Number(t.quantity),
      price: Number(t.price),
      fees: Number(t.fees ?? 0),
      notes: t.notes,
      total:
        t.type === 'achat'
          ? Number(t.quantity) * Number(t.price) + Number(t.fees ?? 0)
          : Number(t.quantity) * Number(t.price) - Number(t.fees ?? 0),
      createdAt: t.createdAt.toISO(),
    }))

    const summary = this.calculateSummary(support, await support.related('transactions').query())

    return inertia.render('investments/show', {
      support: {
        id: support.id,
        userId: support.userId,
        symbol: support.symbol,
        name: support.name,
        type: support.type,
        storageLocation: support.storageLocation,
        annualFees: Number(support.annualFees ?? 0),
        description: support.description,
        externalLink: support.externalLink,
        lastKnownPrice: support.lastKnownPrice ? Number(support.lastKnownPrice) : null,
        lastPriceAt: support.lastPriceAt?.toISO() ?? null,
      },
      transactions: dtos,
      summary,
      pagination: {
        currentPage: transactions.currentPage,
        lastPage: transactions.lastPage,
        perPage: transactions.perPage,
        total: transactions.total,
      },
    })
  }

  async store({ request, response, auth, session, params }: HttpContext) {
    const user = auth.user!
    const support = await InvestmentSupport.query()
      .where('id', params.id)
      .where('userId', user.id)
      .firstOrFail()

    const payload = await request.validateUsing(storeInvestmentTransactionValidator)

    await InvestmentTransaction.create({
      supportId: support.id,
      type: payload.type,
      date: payload.date,
      quantity: payload.quantity,
      price: payload.price,
      fees: payload.fees ?? 0,
      notes: payload.notes,
    })

    session.flash('success', 'Transaction ajoutée')
    response.redirect().toRoute('investissements.show' as any, { id: support.id })
  }

  async update({ request, response, auth, session, params }: HttpContext) {
    const user = auth.user!
    const support = await InvestmentSupport.query()
      .where('id', params.id)
      .where('userId', user.id)
      .firstOrFail()

    const transaction = await InvestmentTransaction.query()
      .where('id', params.transactionId)
      .where('supportId', support.id)
      .firstOrFail()

    const payload = await request.validateUsing(updateInvestmentTransactionValidator)

    transaction.merge({
      type: payload.type ?? transaction.type,
      date: payload.date ?? transaction.date,
      quantity: payload.quantity ?? transaction.quantity,
      price: payload.price ?? transaction.price,
      fees: payload.fees ?? transaction.fees,
      notes: payload.notes ?? transaction.notes,
    })
    await transaction.save()

    session.flash('success', 'Transaction modifiée')
    response.redirect().toRoute('investissements.show' as any, { id: support.id })
  }

  async destroy({ auth, session, response, params }: HttpContext) {
    const user = auth.user!
    const support = await InvestmentSupport.query()
      .where('id', params.id)
      .where('userId', user.id)
      .firstOrFail()

    const transaction = await InvestmentTransaction.query()
      .where('id', params.transactionId)
      .where('supportId', support.id)
      .firstOrFail()

    await transaction.delete()

    session.flash('success', 'Transaction supprimée')
    response.redirect().toRoute('investissements.show' as any, { id: support.id })
  }

  private async calculateSummary(
    support: InvestmentSupport,
    transactions: InvestmentTransaction[]
  ) {
    let totalQuantity = 0
    let totalCost = 0

    for (const t of transactions) {
      const qty = Number(t.quantity)
      const price = Number(t.price)
      const fees = Number(t.fees ?? 0)

      if (t.type === 'achat') {
        totalQuantity += qty
        totalCost += qty * price + fees
      } else {
        totalQuantity -= qty
        totalCost -= qty * price - fees
      }
    }

    const pru = totalQuantity > 0 ? totalCost / totalQuantity : 0
    const currentPrice = support.lastKnownPrice ? Number(support.lastKnownPrice) : 0
    const currentValue = totalQuantity * currentPrice
    const plValue = currentValue - totalCost

    return {
      totalQuantity,
      pru,
      currentValue,
      plValue,
      currentPrice,
    }
  }
}
