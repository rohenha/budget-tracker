import Loan from '#models/loan'
import { storeLoanValidator, updateLoanValidator } from '#validators/loan'
import type { HttpContext } from '@adonisjs/core/http'

export default class LoansController {
  async index({ inertia, auth }: HttpContext) {
    const user = auth.user!
    const loans = await Loan.query().where('userId', user.id)

    const loansWithSummary = loans.map((loan) => ({
      id: loan.id,
      userId: loan.userId,
      name: loan.name,
      borrowedAmount: Number(loan.borrowedAmount),
      downPayment: Number(loan.downPayment),
      interestRate: Number(loan.interestRate),
      durationMonths: loan.durationMonths,
      status: loan.status,
      settled: loan.settled(),
      startDate: loan.startDate.toISODate()!,
      monthlyPayment: loan.monthlyPayment,
      totalInterest: loan.totalInterest,
      totalPaid: loan.totalPaid,
      remainingBalance: loan.remainingBalance,
    }))

    const globalSummary = {
      totalBorrowed: loansWithSummary.reduce((s, l) => s + l.borrowedAmount, 0),
      totalInterest: loansWithSummary.reduce((s, l) => s + l.totalInterest, 0),
      totalPaid: loansWithSummary.reduce((s, l) => s + l.totalPaid, 0),
      ...loansWithSummary.reduce(
        (s, l) => {
          s.currentPaid += l.settled.currentPaid
          s.currentInterest += l.settled.currentInterest
          return s
        },
        { currentPaid: 0, currentInterest: 0 }
      ),
    }

    return inertia.render('credits/index', { loans: loansWithSummary, globalSummary })
  }

  async show({ inertia, auth, params }: HttpContext) {
    const user = auth.user!
    const loan = await Loan.query().where('id', params.id).where('userId', user.id).firstOrFail()
    const schedule = loan.schedule()
    const settled = loan.settled()

    return inertia.render('credits/show', {
      loan: {
        id: loan.id,
        userId: loan.userId,
        name: loan.name,
        borrowedAmount: Number(loan.borrowedAmount),
        downPayment: Number(loan.downPayment),
        interestRate: Number(loan.interestRate),
        durationMonths: loan.durationMonths,
        status: loan.status,
        settled,
        startDate: loan.startDate.toISODate()!,
        monthlyPayment: loan.monthlyPayment,
        totalInterest: loan.totalInterest,
        totalPaid: loan.totalPaid,
        remainingBalance: loan.remainingBalance,
        schedule,
      } satisfies Record<string, unknown>,
    })
  }

  async store({ request, response, auth, session }: HttpContext) {
    const user = auth.user!
    const payload = await request.validateUsing(storeLoanValidator)

    await Loan.create({
      ...payload,
      downPayment: payload.downPayment ?? 0,
      userId: user.id,
    })

    session.flash('success', 'Crédit ajouté')
    response.redirect().toRoute('loans')
  }

  async update({ request, response, auth, params, session }: HttpContext) {
    const user = auth.user!
    const loan = await Loan.query().where('id', params.id).where('userId', user.id).firstOrFail()
    const payload = await request.validateUsing(updateLoanValidator)
    if (payload.name !== undefined) loan.name = payload.name
    if (payload.borrowedAmount !== undefined) loan.borrowedAmount = payload.borrowedAmount
    if (payload.downPayment !== undefined) loan.downPayment = payload.downPayment
    if (payload.interestRate !== undefined) loan.interestRate = payload.interestRate
    if (payload.durationMonths !== undefined) loan.durationMonths = payload.durationMonths
    if (payload.status !== undefined) loan.status = payload.status
    if (payload.startDate !== undefined) loan.startDate = payload.startDate
    await loan.save()

    session.flash('success', 'Crédit modifié')
    response.redirect().toRoute('loans')
  }

  async destroy({ response, auth, params, session }: HttpContext) {
    const user = auth.user!
    const loan = await Loan.query().where('id', params.id).where('userId', user.id).firstOrFail()
    await loan.delete()

    session.flash('success', 'Crédit supprimé')
    response.redirect().toRoute('loans')
  }
}
