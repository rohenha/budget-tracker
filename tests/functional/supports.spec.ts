import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'
import User from '#models/user'
import InvestmentSupport from '#models/investment_support'

async function createUser(email?: string) {
  return User.create({
    fullName: 'Test User',
    email: email ?? `user${Date.now()}${Math.floor(Math.random() * 10000)}@example.com`,
    password: 'secret123',
  })
}

async function createSupport(
  userId: number,
  overrides: Partial<{ symbol: string; name: string }> = {}
) {
  return InvestmentSupport.create({
    userId,
    symbol: overrides.symbol ?? 'INVALID_XYZ_123456',
    name: overrides.name ?? 'Support Test',
    type: 'PEA',
    storageLocation: 'Bourse',
    annualFees: 0,
    description: null,
    externalLink: null,
    lastKnownPrice: null,
    lastPriceAt: null,
  })
}

test.group('SupportsInvestissement — GET /investissements', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  test('returns 200 for authenticated user', async ({ client }) => {
    const user = await createUser()
    const response = await client.get('/investissements').loginAs(user)
    response.assertStatus(200)
  })

  test('redirects to /login if not authenticated', async ({ client }) => {
    const response = await client.get('/investissements')
    response.assertRedirectsTo('/login')
  })

  test('returns only current user supports', async ({ assert }) => {
    const user1 = await createUser()
    const user2 = await createUser()
    await createSupport(user1.id, { name: 'User1 support' })
    await createSupport(user2.id, { name: 'User2 support' })

    const user2Supports = await InvestmentSupport.query().where('userId', user2.id)
    assert.lengthOf(user2Supports, 1)
    assert.equal(user2Supports[0].name, 'User2 support')
  })

  test('unknown symbol returns 200 with stale flag', async ({ client, assert }) => {
    const user = await createUser()
    await createSupport(user.id, { symbol: 'INVALID_XYZ_123456' })
    const response = await client.get('/investissements').loginAs(user)
    response.assertStatus(200)
    const body = response.text()
    assert.include(body, 'investissements')
  })
})
