import { test } from '@japa/runner'
import { cn } from '../../inertia/lib/utils.js'

test.group('cn — class merger', () => {
  test('retourne une chaine vide si aucun argument', ({ assert }) => {
    assert.equal(cn(), '')
  })

  test('retourne la classe si un seul argument', ({ assert }) => {
    assert.equal(cn('foo'), 'foo')
  })

  test('fusionne plusieurs classes', ({ assert }) => {
    assert.equal(cn('foo', 'bar'), 'foo bar')
  })

  test('ignore les valeurs falsy (undefined, null, false)', ({ assert }) => {
    assert.equal(cn('foo', undefined, null, false, 'bar'), 'foo bar')
  })

  test('deduplication Tailwind : la derniere classe gagne', ({ assert }) => {
    // tailwind-merge doit resoudre le conflit px-2 vs px-4
    const result = cn('px-2', 'px-4')
    assert.equal(result, 'px-4')
  })

  test('fusionne les objets conditionnels clsx', ({ assert }) => {
    const result = cn({ 'text-red-500': true, 'text-blue-500': false })
    assert.equal(result, 'text-red-500')
  })

  test('fusionne les tableaux de classes clsx', ({ assert }) => {
    const result = cn(['foo', 'bar'], 'baz')
    assert.equal(result, 'foo bar baz')
  })

  test('resout les conflits de couleur Tailwind', ({ assert }) => {
    const result = cn('bg-red-500', 'bg-blue-500')
    assert.equal(result, 'bg-blue-500')
  })
})
