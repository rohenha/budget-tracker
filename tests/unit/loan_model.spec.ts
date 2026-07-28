import { test } from '@japa/runner'
import { DateTime } from 'luxon'
import Loan from '#models/loan'

/**
 * Les getters et méthodes de Loan sont de la logique pure (pas de DB).
 * On instancie le modèle directement sans sauvegarder.
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
  test('calcule la mensualite avec taux non nul', ({ assert }) => {
    const loan = makeLoan({ borrowedAmount: 10000, interestRate: 5, durationMonths: 12 })
    // formule annuité: P * r(1+r)^n / ((1+r)^n - 1), r = 5/100/12
    assert.approximately(loan.monthlyPayment, 856.07, 0.5)
  })

  test('retourne 0 si montant emprunte est 0', ({ assert }) => {
    const loan = makeLoan({ borrowedAmount: 0, interestRate: 5, durationMonths: 12 })
    assert.equal(loan.monthlyPayment, 0)
  })

  test('divise le principal par n si taux est 0', ({ assert }) => {
    const loan = makeLoan({ borrowedAmount: 12000, interestRate: 0, durationMonths: 12 })
    assert.equal(loan.monthlyPayment, 1000)
  })
})

test.group('Loan — totalInterest', () => {
  test('retourne 0 si taux est 0', ({ assert }) => {
    const loan = makeLoan({ borrowedAmount: 10000, interestRate: 0, durationMonths: 12 })
    assert.equal(loan.totalInterest, 0)
  })

  test('retourne un interet positif avec taux > 0', ({ assert }) => {
    const loan = makeLoan({ borrowedAmount: 10000, interestRate: 5, durationMonths: 12 })
    assert.isAbove(loan.totalInterest, 0)
  })
})

test.group('Loan — totalPaid', () => {
  test('est egal a mensualite * duree', ({ assert }) => {
    const loan = makeLoan({ borrowedAmount: 12000, interestRate: 0, durationMonths: 12 })
    assert.equal(loan.totalPaid, 12000)
  })
})

test.group('Loan — remainingBalance', () => {
  test('retourne 0 si statut paid', ({ assert }) => {
    const loan = makeLoan({ status: 'paid' })
    assert.equal(loan.remainingBalance, 0)
  })

  test('retourne le montant emprunte si statut active', ({ assert }) => {
    const loan = makeLoan({ borrowedAmount: 5000, status: 'active' })
    assert.equal(loan.remainingBalance, 5000)
  })
})

test.group('Loan — schedule()', () => {
  test('retourne un tableau vide si montant est 0', ({ assert }) => {
    const loan = makeLoan({ borrowedAmount: 0 })
    assert.deepEqual(loan.schedule(), [])
  })

  test('retourne n echeances', ({ assert }) => {
    const loan = makeLoan({ borrowedAmount: 10000, interestRate: 5, durationMonths: 12 })
    const schedule = loan.schedule()
    assert.lengthOf(schedule, 12)
  })

  test('la derniere echeance solde le capital (remainingBalance = 0)', ({ assert }) => {
    const loan = makeLoan({ borrowedAmount: 10000, interestRate: 5, durationMonths: 12 })
    const schedule = loan.schedule()
    assert.equal(schedule[schedule.length - 1].remainingBalance, 0)
  })

  test('les numeros d echeance sont sequentiels', ({ assert }) => {
    const loan = makeLoan({ borrowedAmount: 10000, interestRate: 5, durationMonths: 6 })
    const schedule = loan.schedule()
    schedule.forEach((row, i) => assert.equal(row.installmentNumber, i + 1))
  })

  test('les dates d echeance progressent mensuellement', ({ assert }) => {
    const start = DateTime.fromISO('2026-01-01')
    const loan = makeLoan({ durationMonths: 3, startDate: start })
    const schedule = loan.schedule()
    assert.equal(schedule[0].dueDate, '2026-02-01')
    assert.equal(schedule[1].dueDate, '2026-03-01')
    assert.equal(schedule[2].dueDate, '2026-04-01')
  })

  test('sans taux chaque echeance a un interet de 0', ({ assert }) => {
    const loan = makeLoan({ borrowedAmount: 12000, interestRate: 0, durationMonths: 12 })
    const schedule = loan.schedule()
    schedule.forEach((row) => assert.equal(row.interest, 0))
  })
})

test.group('Loan — settled()', () => {
  test('retourne 0 si aucune echeance passee', ({ assert }) => {
    // Prêt commençant dans le futur
    const loan = makeLoan({
      startDate: DateTime.now().plus({ years: 1 }),
      durationMonths: 12,
    })
    const result = loan.settled()
    assert.equal(result.currentPaid, 0)
    assert.equal(result.currentInterest, 0)
  })

  test('retourne des valeurs positives si des echeances sont passees', ({ assert }) => {
    // Prêt commençant il y a 6 mois
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
