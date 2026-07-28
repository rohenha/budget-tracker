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

async function createCategorie(userId: number, overrides: Partial<{
  label: string
  slug: string
  icon: string
  type: 'entree' | 'sortie'
  color: string
  budget: number | null
}> = {}) {
  return Categorie.create({
    userId,
    label: overrides.label ?? 'Alimentation',
    slug: overrides.slug ?? `alimentation-${Date.now()}`,
    icon: overrides.icon ?? 'ShoppingCart',
    type: overrides.type ?? 'sortie',
    color: overrides.color ?? '#ff0000',
    budget: overrides.budget ?? null,
  })
}

test.group('CategoriesController — GET /categories (budget)', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  test('retourne 200 pour un utilisateur connecte', async ({ client }) => {
    const user = await createUser()
    const response = await client.get('/categories').loginAs(user)
    response.assertStatus(200)
  })

  test('redirige vers /login si non connecte', async ({ client }) => {
    const response = await client.get('/categories')
    response.assertRedirectsTo('/login')
  })
})

test.group('CategoriesController — POST /categories (store)', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  test('cree une categorie et redirige', async ({ client, assert }) => {
    const user = await createUser()
    const response = await client.post('/categories').loginAs(user).form({
      label: 'Loisirs',
      icon: 'Gamepad',
      type: 'sortie',
      color: '#00ff00',
    })
    response.assertRedirectsTo('/categories')
    const cat = await Categorie.query().where('userId', user.id).where('label', 'Loisirs').first()
    assert.isNotNull(cat)
  })

  test('echoue si label manquant', async ({ client }) => {
    const user = await createUser()
    const response = await client.post('/categories').loginAs(user).redirects(0).form({
      icon: 'Gamepad',
      type: 'sortie',
      color: '#00ff00',
    })
    response.assertStatus(302)
  })

  test('echoue si couleur invalide', async ({ client }) => {
    const user = await createUser()
    const response = await client.post('/categories').loginAs(user).redirects(0).form({
      label: 'Test',
      icon: 'X',
      type: 'sortie',
      color: 'rouge',
    })
    response.assertStatus(302)
  })

  test('echoue si type invalide', async ({ client }) => {
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

  test('modifie une categorie existante', async ({ client, assert }) => {
    const user = await createUser()
    const cat = await createCategorie(user.id)
    const response = await client.post(`/categories/${cat.id}`).loginAs(user).form({
      label: 'Nouveau Label',
    })
    response.assertRedirectsTo('/categories')
    await cat.refresh()
    assert.equal(cat.label, 'Nouveau Label')
  })

  test('ne peut pas modifier la categorie d un autre utilisateur', async ({ client }) => {
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

  test('supprime une categorie', async ({ client, assert }) => {
    const user = await createUser()
    const cat = await createCategorie(user.id, { slug: 'a-supprimer' })
    // Créer "autre" (requis par le controller)
    await createCategorie(user.id, { slug: 'autre', label: 'Autre' })
    const response = await client.delete(`/categories/${cat.id}`).loginAs(user)
    response.assertRedirectsTo('/categories')
    const deleted = await Categorie.find(cat.id)
    assert.isNull(deleted)
  })

  test('refuse de supprimer la categorie "autre"', async ({ client, assert }) => {
    const user = await createUser()
    const autre = await createCategorie(user.id, { slug: 'autre', label: 'Autre' })
    const response = await client.delete(`/categories/${autre.id}`).loginAs(user).redirects(0)
    // redirige vers la page précédente (logique: if categorie.id === autre.id => redirect back)
    response.assertStatus(302)
    const stillExists = await Categorie.find(autre.id)
    // La catégorie existe toujours
    assert.isNotNull(stillExists)
  })

  test('ne peut pas supprimer la categorie d un autre utilisateur', async ({ client }) => {
    const user1 = await createUser()
    const user2 = await createUser()
    const cat = await createCategorie(user1.id)
    await createCategorie(user1.id, { slug: 'autre', label: 'Autre' })
    const response = await client.delete(`/categories/${cat.id}`).loginAs(user2)
    response.assertStatus(404)
  })
})
