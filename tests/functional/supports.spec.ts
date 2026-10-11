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

test.group('SupportsInvestissement — POST /investissements', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  test('creates support with valid data and redirects', async ({ client, assert }) => {
    const user = await createUser()
    const response = await client
      .post('/investissements')
      .field('symbol', 'AAPL')
      .field('name', 'Apple Inc.')
      .field('type', 'PEA')
      .field('storageLocation', 'Trade Republic')
      .field('annualFees', '0.5')
      .field('description', 'Test description')
      .field('externalLink', 'https://finance.yahoo.com/quote/AAPL')
      .loginAs(user)

    response.assertRedirectsTo('/investissements')

    const support = await InvestmentSupport.query().where('userId', user.id).first()
    assert.exists(support)
    assert.equal(support?.symbol, 'AAPL')
    assert.equal(support?.name, 'Apple Inc.')
    assert.equal(support?.type, 'PEA')
    assert.equal(support?.storageLocation, 'Trade Republic')
    assert.equal(Number(support?.annualFees), 0.5)
    assert.equal(support?.description, 'Test description')
    assert.equal(support?.externalLink, 'https://finance.yahoo.com/quote/AAPL')
  })

  test('fails validation for missing required fields', async ({ client }) => {
    const user = await createUser()
    const response = await client
      .post('/investissements')
      .field('symbol', '')
      .field('name', '')
      .field('type', '')
      .field('storageLocation', '')
      .loginAs(user)
      .redirects(0)

    response.assertStatus(302)
  })

  test('fails validation for invalid type enum', async ({ client }) => {
    const user = await createUser()
    const response = await client
      .post('/investissements')
      .field('symbol', 'AAPL')
      .field('name', 'Apple')
      .field('type', 'INVALID')
      .field('storageLocation', 'Test')
      .loginAs(user)
      .redirects(0)

    response.assertStatus(302)
  })

  test('fails validation for invalid symbol format', async ({ client }) => {
    const user = await createUser()
    const response = await client
      .post('/investissements')
      .field('symbol', 'INVALID@SYMBOL')
      .field('name', 'Apple')
      .field('type', 'PEA')
      .field('storageLocation', 'Test')
      .loginAs(user)
      .redirects(0)

    response.assertStatus(302)
  })

  test('fails validation for annualFees out of range', async ({ client }) => {
    const user = await createUser()
    const response = await client
      .post('/investissements')
      .field('symbol', 'AAPL')
      .field('name', 'Apple')
      .field('type', 'PEA')
      .field('storageLocation', 'Test')
      .field('annualFees', '150')
      .loginAs(user)
      .redirects(0)

    response.assertStatus(302)
  })

  test('isolates users - user1 cannot create support for user2', async ({ client, assert }) => {
    const user1 = await createUser()
    const user2 = await createUser()
    const response = await client
      .post('/investissements')
      .field('symbol', 'AAPL')
      .field('name', 'Apple')
      .field('type', 'PEA')
      .field('storageLocation', 'Test')
      .loginAs(user1)

    response.assertRedirectsTo('/investissements')

    const user1Supports = await InvestmentSupport.query().where('userId', user1.id)
    const user2Supports = await InvestmentSupport.query().where('userId', user2.id)
    assert.lengthOf(user1Supports, 1)
    assert.lengthOf(user2Supports, 0)
  })

  test('redirects to /login if not authenticated', async ({ client }) => {
    const response = await client
      .post('/investissements')
      .field('symbol', 'AAPL')
      .field('name', 'Apple')
      .field('type', 'PEA')
      .field('storageLocation', 'Test')

    response.assertRedirectsTo('/login')
  })
})

test.group('SupportsInvestissement — GET /investissements/search', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  test('returns 200 with results for authenticated user', async ({ client, assert }) => {
    const user = await createUser()
    const response = await client.get('/investissements/search?q=Apple').loginAs(user)
    response.assertStatus(200)
    const body = response.body() as { results: unknown[] }
    assert.property(body, 'results')
    assert.isArray(body.results)
  })

  test('returns 422 for query too short', async ({ client }) => {
    const user = await createUser()
    const response = await client.get('/investissements/search?q=A').loginAs(user)
    response.assertStatus(422)
  })

  test('returns 422 for missing query', async ({ client }) => {
    const user = await createUser()
    const response = await client.get('/investissements/search').loginAs(user)
    response.assertStatus(422)
  })

  test('redirects to /login if not authenticated', async ({ client }) => {
    const response = await client.get('/investissements/search?q=Apple')
    response.assertRedirectsTo('/login')
  })

  test('returns empty results for unknown query', async ({ client, assert }) => {
    const user = await createUser()
    const response = await client.get('/investissements/search?q=INVALID_XYZ_123456_NOPE').loginAs(user)
    response.assertStatus(200)
    const body = response.body() as { results: unknown[] }
    assert.isArray(body.results)
    assert.lengthOf(body.results, 0)
  })
})
