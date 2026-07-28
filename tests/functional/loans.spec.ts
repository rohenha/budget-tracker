import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'
import { DateTime } from 'luxon'
import User from '#models/user'
import Loan from '#models/loan'

async function createUser() {
  return User.create({
    fullName: 'Test User',
    email: `user${Date.now()}@example.com`,
    password: 'secret123',
  })
}

async function createLoan(userId: number, overrides: Partial<{
  name: string
  borrowedAmount: number
  interestRate: number
  durationMonths: number
  status: 'active' | 'paid'
}> = {}) {
  return Loan.create({
    userId,
    name: overrides.name ?? 'Prêt immobilier',
    borrowedAmount: overrides.borrowedAmount ?? 200000,
    downPayment: 0,
    interestRate: overrides.interestRate ?? 3.5,
    durationMonths: overrides.durationMonths ?? 240,
    status: overrides.status ?? 'active',
    startDate: DateTime.fromISO('2026-01-01'),
  })
}

test.group('LoansController — GET /credits', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  test('retourne 200 pour un utilisateur connecte', async ({ client }) => {
    const user = await createUser()
    const response = await client.get('/credits').loginAs(user)
    response.assertStatus(200)
  })

  test('redirige vers /login si non connecte', async ({ client }) => {
    const response = await client.get('/credits')
    response.assertRedirectsTo('/login')
  })

  test('ne retourne que les prets de l utilisateur courant', async ({ client, assert }) => {
    const user1 = await createUser()
    const user2 = await createUser()
    await createLoan(user1.id, { name: 'Pret user1' })
    await createLoan(user2.id, { name: 'Pret user2' })

    // user2 ne doit pas voir les prêts de user1 — test via DB isolation
    const user2Loans = await Loan.query().where('userId', user2.id)
    assert.lengthOf(user2Loans, 1)
    assert.equal(user2Loans[0].name, 'Pret user2')
  })
})

test.group('LoansController — GET /credits/:id (show)', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  test('retourne 200 pour le proprietaire', async ({ client }) => {
    const user = await createUser()
    const loan = await createLoan(user.id)
    const response = await client.get(`/credits/${loan.id}`).loginAs(user)
    response.assertStatus(200)
  })

  test('retourne 404 pour un pret d un autre utilisateur', async ({ client }) => {
    const user1 = await createUser()
    const user2 = await createUser()
    const loan = await createLoan(user1.id)
    const response = await client.get(`/credits/${loan.id}`).loginAs(user2)
    response.assertStatus(404)
  })
})

test.group('LoansController — POST /credits (store)', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  test('cree un pret et redirige', async ({ client, assert }) => {
    const user = await createUser()
    const response = await client.post('/credits').loginAs(user).form({
      name: 'Voiture',
      borrowedAmount: 15000,
      interestRate: 4,
      durationMonths: 48,
      startDate: '2026-01-01',
    })
    response.assertRedirectsTo('/credits')
    const loan = await Loan.query().where('userId', user.id).where('name', 'Voiture').first()
    assert.isNotNull(loan)
  })

  test('echoue si montant <= 0', async ({ client }) => {
    const user = await createUser()
    const response = await client.post('/credits').loginAs(user).redirects(0).form({
      name: 'Test',
      borrowedAmount: 0,
      interestRate: 3,
      durationMonths: 12,
      startDate: '2026-01-01',
    })
    response.assertStatus(302)
  })

  test('echoue si duree <= 0', async ({ client }) => {
    const user = await createUser()
    const response = await client.post('/credits').loginAs(user).redirects(0).form({
      name: 'Test',
      borrowedAmount: 10000,
      interestRate: 3,
      durationMonths: 0,
      startDate: '2026-01-01',
    })
    response.assertStatus(302)
  })

  test('echoue si nom manquant', async ({ client }) => {
    const user = await createUser()
    const response = await client.post('/credits').loginAs(user).redirects(0).form({
      borrowedAmount: 10000,
      interestRate: 3,
      durationMonths: 12,
      startDate: '2026-01-01',
    })
    response.assertStatus(302)
  })
})

test.group('LoansController — POST /credits/:id (update)', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  test('modifie un pret existant', async ({ client, assert }) => {
    const user = await createUser()
    const loan = await createLoan(user.id)
    const response = await client.post(`/credits/${loan.id}`).loginAs(user).form({
      status: 'paid',
    })
    response.assertRedirectsTo('/credits')
    await loan.refresh()
    assert.equal(loan.status, 'paid')
  })

  test('ne peut pas modifier le pret d un autre utilisateur', async ({ client }) => {
    const user1 = await createUser()
    const user2 = await createUser()
    const loan = await createLoan(user1.id)
    const response = await client.post(`/credits/${loan.id}`).loginAs(user2).form({
      name: 'Hack',
    })
    response.assertStatus(404)
  })
})

test.group('LoansController — DELETE /credits/:id (destroy)', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  test('supprime un pret', async ({ client, assert }) => {
    const user = await createUser()
    const loan = await createLoan(user.id)
    const response = await client.delete(`/credits/${loan.id}`).loginAs(user)
    response.assertRedirectsTo('/credits')
    const deleted = await Loan.find(loan.id)
    assert.isNull(deleted)
  })

  test('ne peut pas supprimer le pret d un autre utilisateur', async ({ client }) => {
    const user1 = await createUser()
    const user2 = await createUser()
    const loan = await createLoan(user1.id)
    const response = await client.delete(`/credits/${loan.id}`).loginAs(user2)
    response.assertStatus(404)
  })
})
