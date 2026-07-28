import { test } from '@japa/runner'
import User from '#models/user'

/**
 * Instancie un User sans passer par la DB.
 */
function makeUser(overrides: Partial<{ fullName: string | null; email: string }> = {}) {
  const user = new User()
  user.fullName = overrides.fullName ?? null
  user.email = overrides.email ?? 'john.doe@example.com'
  return user
}

test.group('User — initials getter', () => {
  test('retourne les initiales du prenom et nom', ({ assert }) => {
    const user = makeUser({ fullName: 'John Doe' })
    assert.equal(user.initials, 'JD')
  })

  test('retourne les initiales en majuscules', ({ assert }) => {
    const user = makeUser({ fullName: 'alice martin' })
    assert.equal(user.initials, 'AM')
  })

  test('retourne 2 lettres si un seul mot dans fullName', ({ assert }) => {
    const user = makeUser({ fullName: 'Mononym' })
    assert.equal(user.initials, 'MO')
  })

  test('utilise email si fullName est null', ({ assert }) => {
    const user = makeUser({ fullName: null, email: 'bob@example.com' })
    // split('@') => ['bob', 'example.com'] => initials = 'BE'
    assert.equal(user.initials, 'BE')
  })

  test('utilise email si fullName est une chaine vide', ({ assert }) => {
    const user = makeUser({ fullName: '', email: 'carol@test.com' })
    // '' split(' ') => ['', ''] => first='', last='' => utilise email path ? Non
    // '' est falsy donc on prend email split('@') => ['carol', 'test.com']
    assert.equal(user.initials, 'CT')
  })
})
