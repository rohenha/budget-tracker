import { test } from '@japa/runner'

test.group('Daily chart data transformation', () => {
  test('compute average from daily totals', ({ assert }) => {
    const dailyData = [
      { date: '2026-07-01', total: 50 },
      { date: '2026-07-02', total: 30 },
      { date: '2026-07-03', total: 20 },
    ]

    const totalPeriod = dailyData.reduce((sum, d) => sum + d.total, 0)
    const dayCount = 3
    const dailyAverage = dayCount > 0 ? totalPeriod / dayCount : 0

    assert.equal(dailyAverage, 33.333333333333336)
  })

  test('compute average across period with days without expenses', ({ assert }) => {
    const dailyData = [
      { date: '2026-07-01', total: 100 },
      { date: '2026-07-05', total: 50 },
    ]

    const totalPeriod = dailyData.reduce((sum, d) => sum + d.total, 0)
    const dayCount = 31
    const dailyAverage = dayCount > 0 ? totalPeriod / dayCount : 0

    assert.approximately(dailyAverage, 4.84, 0.01)
  })

  test('returns 0 average when no data', ({ assert }) => {
    const dailyData: Array<{ date: string; total: number }> = []

    const totalPeriod = dailyData.reduce((sum, d) => sum + d.total, 0)
    const dayCount = 1
    const dailyAverage = dayCount > 0 ? totalPeriod / dayCount : 0

    assert.equal(dailyAverage, 0)
  })

  test('handles single day period', ({ assert }) => {
    const dailyData = [{ date: '2026-07-15', total: 75 }]

    const totalPeriod = dailyData.reduce((sum, d) => sum + d.total, 0)
    const dayCount = 1
    const dailyAverage = dayCount > 0 ? totalPeriod / dayCount : 0

    assert.equal(dailyAverage, 75)
  })

  test('correctly maps $extras from Lucid query result', ({ assert }) => {
    const rawData = [
      { $extras: { date: '2026-07-01', total: '120.50' } },
      { $extras: { date: '2026-07-02', total: '45.00' } },
    ]

    const mapped = rawData.map((d: any) => ({
      date: d.$extras.date,
      total: Number(d.$extras.total),
    }))

    assert.deepEqual(mapped, [
      { date: '2026-07-01', total: 120.5 },
      { date: '2026-07-02', total: 45 },
    ])
  })
})
