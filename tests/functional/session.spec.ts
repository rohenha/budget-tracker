import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'

test.group('SessionController', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  // ─── GET /login ──────────────────────────────────────────────────────────────

  test('GET /login retourne 200 pour un invité', async ({ client }) => {
    const response = await client.get('/login')
    response.assertStatus(200)
  })

  test('GET /login redirige si déjà connecté', async ({ client }) => {
    const user = await createUser()
    const response = await client.get('/login').loginAs(user)
    response.assertRedirectsTo('/')
  })

  // ─── POST /login ─────────────────────────────────────────────────────────────

  test('POST /login connecte avec identifiants valides', async ({ client }) => {
    const user = await createUser({ email: 'test@example.com', password: 'secret123' })
    const response = await client.post('/login').form({
      email: 'test@example.com',
      password: 'secret123',
    })
    response.assertRedirectsTo('/dashboard')
    _ = user
  })

  test('POST /login echoue avec mauvais mot de passe', async ({ client }) => {
    await createUser({ email: 'test@example.com', password: 'secret123' })
    const response = await client.post('/login').redirects(0).form({
      email: 'test@example.com',
      password: 'wrongpassword',
    })
    response.assertStatus(302)
  })

  test('POST /login echoue si email inconnu', async ({ client }) => {
    const response = await client.post('/login').redirects(0).form({
      email: 'notexist@example.com',
      password: 'secret123',
    })
    response.assertStatus(302)
  })

  // ─── POST /logout ─────────────────────────────────────────────────────────────

  test('POST /logout deconnecte et redirige vers /login', async ({ client }) => {
    const user = await createUser()
    const response = await client.post('/logout').loginAs(user)
    response.assertRedirectsTo('/login')
  })
})

// ─── GET /signup ─────────────────────────────────────────────────────────────

test.group('NewAccountController', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  test('GET /signup retourne 200 pour un invité', async ({ client }) => {
    const response = await client.get('/signup')
    response.assertStatus(200)
  })

  test('POST /signup cree un compte et redirige vers /dashboard', async ({ client }) => {
    const response = await client.post('/signup').form({
      fullName: 'Test User',
      email: 'newuser@example.com',
      password: 'password123',
      passwordConfirmation: 'password123',
    })
    response.assertRedirectsTo('/dashboard')
  })

  test('POST /signup echoue si email deja utilise', async ({ client }) => {
    await createUser({ email: 'dupe@example.com' })
    const response = await client.post('/signup').redirects(0).form({
      fullName: 'Dupe User',
      email: 'dupe@example.com',
      password: 'password123',
      passwordConfirmation: 'password123',
    })
    response.assertStatus(302)
  })

  test('POST /signup echoue si confirmation du mot de passe ne correspond pas', async ({
    client,
  }) => {
    const response = await client.post('/signup').redirects(0).form({
      fullName: 'Test',
      email: 'mismatch@example.com',
      password: 'password123',
      passwordConfirmation: 'DIFFERENT',
    })
    response.assertStatus(302)
  })

  test('POST /signup cree la categorie "Autre" par defaut', async ({ client, assert }) => {
    await client.post('/signup').form({
      fullName: 'Cat Test',
      email: 'cattest@example.com',
      password: 'password123',
      passwordConfirmation: 'password123',
    })
    const { default: Categorie } = await import('#models/categorie')
    const { default: User } = await import('#models/user')
    const user = await User.findByOrFail('email', 'cattest@example.com')
    const autre = await Categorie.query().where('userId', user.id).where('slug', 'autre').first()
    assert.isNotNull(autre)
  })
})

// ─── Helper ──────────────────────────────────────────────────────────────────

let _ : any

async function createUser(opts: { email?: string; password?: string } = {}) {
  const { default: User } = await import('#models/user')
  return User.create({
    fullName: 'Test User',
    email: opts.email ?? `user${Date.now()}@example.com`,
    password: opts.password ?? 'secret123',
  })
}
