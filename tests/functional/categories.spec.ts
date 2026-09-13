import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'
import User from '#models/user'
import Categorie from '#models/categorie'

async function createUser() {
  return User.create({
    fullName: 'Test User',
    email: `user${Date.now()}@example.com`,
    password: 'secret123',
  })
}

async function createCategorie(
  userId: number,
  overrides: Partial<{
    label: string
    slug: string
    icon: string
    type: 'entree' | 'sortie'
    color: string
    budget: number | null
  }> = {}
) {
  return Categorie.create({
    userId,
    label: overrides.label ?? 'Groceries',
    slug: overrides.slug ?? `groceries-${Date.now()}`,
    icon: overrides.icon ?? 'ShoppingCart',
    type: overrides.type ?? 'sortie',
    color: overrides.color ?? '#ff0000',
    budget: overrides.budget ?? null,
  })
}

test.group('CategoriesController — GET /categories (budget)', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  test('returns 200 for authenticated user', async ({ client }) => {
    const user = await createUser()
    const response = await client.get('/categories').loginAs(user)
    response.assertStatus(200)
  })

  test('redirects to /login if not authenticated', async ({ client }) => {
    const response = await client.get('/categories')
    response.assertRedirectsTo('/login')
  })
})

test.group('CategoriesController — POST /categories (store)', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  test('creates a category and redirects', async ({ client, assert }) => {
    const user = await createUser()
    const response = await client.post('/categories').loginAs(user).form({
      label: 'Leisure',
      icon: 'Gamepad',
      type: 'sortie',
      color: '#00ff00',
    })
    response.assertRedirectsTo('/categories')
    const cat = await Categorie.query().where('userId', user.id).where('label', 'Leisure').first()
    assert.isNotNull(cat)
  })

  test('fails if label missing', async ({ client }) => {
    const user = await createUser()
    const response = await client.post('/categories').loginAs(user).redirects(0).form({
      icon: 'Gamepad',
      type: 'sortie',
      color: '#00ff00',
    })
    response.assertStatus(302)
  })

  test('fails if color invalid', async ({ client }) => {
    const user = await createUser()
    const response = await client.post('/categories').loginAs(user).redirects(0).form({
      label: 'Test',
      icon: 'X',
      type: 'sortie',
      color: 'red',
    })
    response.assertStatus(302)
  })

  test('fails if type invalid', async ({ client }) => {
    const user = await createUser()
    const response = await client.post('/categories').loginAs(user).redirects(0).form({
      label: 'Test',
      icon: 'X',
      type: 'invalid',
      color: '#ffffff',
    })
    response.assertStatus(302)
  })
})

test.group('CategoriesController — POST /categories/:id (update)', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  test('updates an existing category', async ({ client, assert }) => {
    const user = await createUser()
    const cat = await createCategorie(user.id)
    const response = await client.post(`/categories/${cat.id}`).loginAs(user).form({
      label: 'New Label',
    })
    response.assertRedirectsTo('/categories')
    await cat.refresh()
    assert.equal(cat.label, 'New Label')
  })

  test('cannot update another user category', async ({ client }) => {
    const user1 = await createUser()
    const user2 = await createUser()
    const cat = await createCategorie(user1.id)
    const response = await client.post(`/categories/${cat.id}`).loginAs(user2).form({
      label: 'Hack',
    })
    response.assertStatus(404)
  })
})

test.group('CategoriesController — DELETE /categories/:id (destroy)', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  test('deletes a category', async ({ client, assert }) => {
    const user = await createUser()
    const cat = await createCategorie(user.id, { slug: 'to-delete' })
    // Create "other" (required by controller)
    await createCategorie(user.id, { slug: 'autre', label: 'Other' })
    const response = await client.delete(`/categories/${cat.id}`).loginAs(user)
    response.assertRedirectsTo('/categories')
    const deleted = await Categorie.find(cat.id)
    assert.isNull(deleted)
  })

  test('refuses to delete "other" category', async ({ client, assert }) => {
    const user = await createUser()
    const autre = await createCategorie(user.id, { slug: 'autre', label: 'Other' })
    const response = await client.delete(`/categories/${autre.id}`).loginAs(user).redirects(0)
    // redirects to previous page (logic: if categorie.id === autre.id => redirect back)
    response.assertStatus(302)
    const stillExists = await Categorie.find(autre.id)
    // Category still exists
    assert.isNotNull(stillExists)
  })

  test('cannot delete another user category', async ({ client }) => {
    const user1 = await createUser()
    const user2 = await createUser()
    const cat = await createCategorie(user1.id)
    await createCategorie(user1.id, { slug: 'autre', label: 'Other' })
    const response = await client.delete(`/categories/${cat.id}`).loginAs(user2)
    response.assertStatus(404)
  })
})
