import { test } from '@japa/runner'
import { cn } from '../../inertia/lib/utils.js'

test.group('cn — class merger', () => {
  test('returns empty string if no argument', ({ assert }) => {
    assert.equal(cn(), '')
  })

  test('returns class if single argument', ({ assert }) => {
    assert.equal(cn('foo'), 'foo')
  })

  test('merges multiple classes', ({ assert }) => {
    assert.equal(cn('foo', 'bar'), 'foo bar')
  })

  test('ignores falsy values (undefined, null, false)', ({ assert }) => {
    assert.equal(cn('foo', undefined, null, false, 'bar'), 'foo bar')
  })

  test('Tailwind dedup: last class wins', ({ assert }) => {
    // tailwind-merge must resolve px-2 vs px-4 conflict
    const result = cn('px-2', 'px-4')
    assert.equal(result, 'px-4')
  })

  test('merges clsx conditional objects', ({ assert }) => {
    const result = cn({ 'text-red-500': true, 'text-blue-500': false })
    assert.equal(result, 'text-red-500')
  })

  test('merges clsx class arrays', ({ assert }) => {
    const result = cn(['foo', 'bar'], 'baz')
    assert.equal(result, 'foo bar baz')
  })

  test('resolves Tailwind color conflicts', ({ assert }) => {
    const result = cn('bg-red-500', 'bg-blue-500')
    assert.equal(result, 'bg-blue-500')
  })
})
