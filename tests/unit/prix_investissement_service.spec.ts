import { test } from '@japa/runner'
import { getCurrentPrice, searchSymbols } from '#services/prix_investissement_service'

test.group('PrixInvestissementService', () => {
  test('invalid symbol returns null without throwing', async ({ assert }) => {
    const price = await getCurrentPrice('INVALID_XYZ_123456_NOPE')
    assert.isNull(price)
  })

  test('empty symbol returns null without throwing', async ({ assert }) => {
    const price = await getCurrentPrice('')
    assert.isNull(price)
  })

  test('searchSymbols returns empty array for short query', async ({ assert }) => {
    const results = await searchSymbols('A')
    assert.isArray(results)
    assert.lengthOf(results, 0)
  })

  test('searchSymbols returns empty array for empty query', async ({ assert }) => {
    const results = await searchSymbols('')
    assert.isArray(results)
    assert.lengthOf(results, 0)
  })

  test('searchSymbols returns results for valid query', async ({ assert }) => {
    const results = await searchSymbols('Apple')
    assert.isArray(results)
    if (results.length > 0) {
      assert.property(results[0], 'exchange')
      assert.isTrue(Boolean(results[0].shortname || results[0].longname))
      assert.property(results[0], 'quoteType')
      assert.isTrue(['EQUITY', 'ETF', 'MUTUALFUND'].includes(results[0].quoteType))
      assert.property(results[0], 'symbol')
      assert.property(results[0], 'index')
      assert.property(results[0], 'score')
      assert.property(results[0], 'typeDisp')
      assert.property(results[0], 'isYahooFinance')
    }
  })
})
