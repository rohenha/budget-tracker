import { test } from '@japa/runner'
import User from '#models/user'

/**
 * Instantiates a User without going through the DB.
 */
function makeUser(overrides: Partial<{ fullName: string | null; email: string }> = {}) {
  const user = new User()
  user.fullName = overrides.fullName ?? null
  user.email = overrides.email ?? 'john.doe@example.com'
  return user
}

test.group('User — initials getter', () => {
  test('returns first and last name initials', ({ assert }) => {
    const user = makeUser({ fullName: 'John Doe' })
    assert.equal(user.initials, 'JD')
  })

  test('returns uppercase initials', ({ assert }) => {
    const user = makeUser({ fullName: 'alice martin' })
    assert.equal(user.initials, 'AM')
  })

  test('returns 2 letters if single word in fullName', ({ assert }) => {
    const user = makeUser({ fullName: 'Mononym' })
    assert.equal(user.initials, 'MO')
  })

  test('uses email if fullName is null', ({ assert }) => {
    const user = makeUser({ fullName: null, email: 'bob@example.com' })
    // split('@') => ['bob', 'example.com'] => initials = 'BE'
    assert.equal(user.initials, 'BE')
  })

  test('uses email if fullName is empty string', ({ assert }) => {
    const user = makeUser({ fullName: '', email: 'carol@test.com' })
    // '' split(' ') => ['', ''] => first='', last='' => uses email path? No
    // '' is falsy so we take email split('@') => ['carol', 'test.com']
    assert.equal(user.initials, 'CT')
  })
})
