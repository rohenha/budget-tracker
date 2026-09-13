import { test } from '@japa/runner'
import { getCurrentPrice } from '#services/prix_investissement_service'

test.group('PrixInvestissementService', () => {
  test('invalid symbol returns null without throwing', async ({ assert }) => {
    const price = await getCurrentPrice('INVALID_XYZ_123456_NOPE')
    assert.isNull(price)
  })

  test('empty symbol returns null without throwing', async ({ assert }) => {
    const price = await getCurrentPrice('')
    assert.isNull(price)
  })
})
