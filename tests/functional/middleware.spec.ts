import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'
import User from '#models/user'

async function createUser() {
  return User.create({
    fullName: 'Test User',
    email: `user${Date.now()}@example.com`,
    password: 'secret123',
  })
}

// Routes protégées (auth middleware)
const AUTH_ROUTES = ['/dashboard', '/categories', '/depenses', '/credits']

// Routes invité (guest middleware)
const GUEST_ROUTES = ['/login', '/signup']

test.group('AuthMiddleware — routes protegees', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  for (const route of AUTH_ROUTES) {
    test(`GET ${route} redirige vers /login si non connecte`, async ({ client }) => {
      const response = await client.get(route)
      response.assertRedirectsTo('/login')
    })

    test(`GET ${route} retourne 200 si connecte`, async ({ client }) => {
      const user = await createUser()
      const response = await client.get(route).loginAs(user)
      response.assertStatus(200)
    })
  }
})

test.group('GuestMiddleware — routes invites', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  for (const route of GUEST_ROUTES) {
    test(`GET ${route} retourne 200 si non connecte`, async ({ client }) => {
      const response = await client.get(route)
      response.assertStatus(200)
    })

    test(`GET ${route} redirige si deja connecte`, async ({ client }) => {
      const user = await createUser()
      const response = await client.get(route).loginAs(user)
      response.assertRedirectsTo('/')
    })
  }
})
