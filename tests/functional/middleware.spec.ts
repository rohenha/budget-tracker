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

// Protected routes (auth middleware)
const AUTH_ROUTES = ['/dashboard', '/categories', '/depenses', '/credits']

// Guest routes (guest middleware)
const GUEST_ROUTES = ['/login', '/signup']

test.group('AuthMiddleware — protected routes', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  for (const route of AUTH_ROUTES) {
    test(`GET ${route} redirects to /login if not authenticated`, async ({ client }) => {
      const response = await client.get(route)
      response.assertRedirectsTo('/login')
    })

    test(`GET ${route} returns 200 if authenticated`, async ({ client }) => {
      const user = await createUser()
      const response = await client.get(route).loginAs(user)
      response.assertStatus(200)
    })
  }
})

test.group('GuestMiddleware — guest routes', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  for (const route of GUEST_ROUTES) {
    test(`GET ${route} returns 200 if not authenticated`, async ({ client }) => {
      const response = await client.get(route)
      response.assertStatus(200)
    })

    test(`GET ${route} redirects if already authenticated`, async ({ client }) => {
      const user = await createUser()
      const response = await client.get(route).loginAs(user)
      response.assertRedirectsTo('/')
    })
  }
})
