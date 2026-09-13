import { test } from '@japa/runner'
import { DateTime } from 'luxon'
import Loan from '#models/loan'

/**
 * The getters and methods of Loan are pure logic (no DB).
 * We instantiate the model directly without saving.
 */
function makeLoan(overrides: Partial<{
  borrowedAmount: number
  downPayment: number
  interestRate: number
  durationMonths: number
  status: 'active' | 'paid'
  startDate: DateTime
}> = {}) {
  const loan = new Loan()
  loan.borrowedAmount = overrides.borrowedAmount ?? 10000
  loan.downPayment = overrides.downPayment ?? 0
  loan.interestRate = overrides.interestRate ?? 5
  loan.durationMonths = overrides.durationMonths ?? 12
  loan.status = overrides.status ?? 'active'
  loan.startDate = overrides.startDate ?? DateTime.fromISO('2026-01-01')
  return loan
}

test.group('Loan — monthlyPayment', () => {
  test('calculates monthly payment with non-zero rate', ({ assert }) => {
    const loan = makeLoan({ borrowedAmount: 10000, interestRate: 5, durationMonths: 12 })
    // annuity formula: P * r(1+r)^n / ((1+r)^n - 1), r = 5/100/12
    assert.approximately(loan.monthlyPayment, 856.07, 0.5)
  })

  test('returns 0 if borrowed amount is 0', ({ assert }) => {
    const loan = makeLoan({ borrowedAmount: 0, interestRate: 5, durationMonths: 12 })
    assert.equal(loan.monthlyPayment, 0)
  })

  test('divides principal by n if rate is 0', ({ assert }) => {
    const loan = makeLoan({ borrowedAmount: 12000, interestRate: 0, durationMonths: 12 })
    assert.equal(loan.monthlyPayment, 1000)
  })
})

test.group('Loan — totalInterest', () => {
  test('returns 0 if rate is 0', ({ assert }) => {
    const loan = makeLoan({ borrowedAmount: 10000, interestRate: 0, durationMonths: 12 })
    assert.equal(loan.totalInterest, 0)
  })

  test('returns positive interest with rate > 0', ({ assert }) => {
    const loan = makeLoan({ borrowedAmount: 10000, interestRate: 5, durationMonths: 12 })
    assert.isAbove(loan.totalInterest, 0)
  })
})

test.group('Loan — totalPaid', () => {
  test('equals monthly payment * duration', ({ assert }) => {
    const loan = makeLoan({ borrowedAmount: 12000, interestRate: 0, durationMonths: 12 })
    assert.equal(loan.totalPaid, 12000)
  })
})

test.group('Loan — remainingBalance', () => {
  test('returns 0 if status paid', ({ assert }) => {
    const loan = makeLoan({ status: 'paid' })
    assert.equal(loan.remainingBalance, 0)
  })

  test('returns borrowed amount if status active', ({ assert }) => {
    const loan = makeLoan({ borrowedAmount: 5000, status: 'active' })
    assert.equal(loan.remainingBalance, 5000)
  })
})

test.group('Loan — schedule()', () => {
  test('returns empty array if amount is 0', ({ assert }) => {
    const loan = makeLoan({ borrowedAmount: 0 })
    assert.deepEqual(loan.schedule(), [])
  })

  test('returns n installments', ({ assert }) => {
    const loan = makeLoan({ borrowedAmount: 10000, interestRate: 5, durationMonths: 12 })
    const schedule = loan.schedule()
    assert.lengthOf(schedule, 12)
  })

  test('last installment settles principal (remainingBalance = 0)', ({ assert }) => {
    const loan = makeLoan({ borrowedAmount: 10000, interestRate: 5, durationMonths: 12 })
    const schedule = loan.schedule()
    assert.equal(schedule[schedule.length - 1].remainingBalance, 0)
  })

  test('installment numbers are sequential', ({ assert }) => {
    const loan = makeLoan({ borrowedAmount: 10000, interestRate: 5, durationMonths: 6 })
    const schedule = loan.schedule()
    schedule.forEach((row, i) => assert.equal(row.installmentNumber, i + 1))
  })

  test('installment dates progress monthly', ({ assert }) => {
    const start = DateTime.fromISO('2026-01-01')
    const loan = makeLoan({ durationMonths: 3, startDate: start })
    const schedule = loan.schedule()
    assert.equal(schedule[0].dueDate, '2026-02-01')
    assert.equal(schedule[1].dueDate, '2026-03-01')
    assert.equal(schedule[2].dueDate, '2026-04-01')
  })

  test('without rate each installment has 0 interest', ({ assert }) => {
    const loan = makeLoan({ borrowedAmount: 12000, interestRate: 0, durationMonths: 12 })
    const schedule = loan.schedule()
    schedule.forEach((row) => assert.equal(row.interest, 0))
  })
})

test.group('Loan — settled()', () => {
  test('returns 0 if no past installment', ({ assert }) => {
    // Loan starting in the future
    const loan = makeLoan({
      startDate: DateTime.now().plus({ years: 1 }),
      durationMonths: 12,
    })
    const result = loan.settled()
    assert.equal(result.currentPaid, 0)
    assert.equal(result.currentInterest, 0)
  })

  test('returns positive values if installments are past', ({ assert }) => {
    // Loan starting 6 months ago
    const loan = makeLoan({
      startDate: DateTime.now().minus({ months: 6 }),
      borrowedAmount: 10000,
      interestRate: 5,
      durationMonths: 24,
    })
    const result = loan.settled()
    assert.isAbove(result.currentPaid, 0)
    assert.isAbove(result.currentInterest, 0)
  })
})
