import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'
import { DateTime } from 'luxon'
import User from '#models/user'
import Categorie from '#models/categorie'
import Depense from '#models/depense'

async function createUser() {
  return User.create({
    fullName: 'Test User',
    email: `user${Date.now()}@example.com`,
    password: 'secret123',
  })
}

async function createCategorie(userId: number, type: 'entree' | 'sortie' = 'sortie') {
  return Categorie.create({
    userId,
    label: 'Alimentation',
    slug: `cat-${Date.now()}-${Math.random()}`,
    icon: 'ShoppingCart',
    type,
    color: '#ff0000',
  })
}

async function createDepense(userId: number, categorieId: number, overrides: Partial<{
  libelle: string
  montant: number
  type: 'entree' | 'sortie'
  date: DateTime
}> = {}) {
  return Depense.create({
    userId,
    categorieId,
    libelle: overrides.libelle ?? 'Courses',
    montant: overrides.montant ?? 50,
    type: overrides.type ?? 'sortie',
    date: overrides.date ?? DateTime.now(),
  })
}

test.group('DepensesController — GET /depenses', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  test('retourne 200 pour un utilisateur connecte', async ({ client }) => {
    const user = await createUser()
    const response = await client.get('/depenses').loginAs(user)
    response.assertStatus(200)
  })

  test('redirige vers /login si non connecte', async ({ client }) => {
    const response = await client.get('/depenses')
    response.assertRedirectsTo('/login')
  })

  test('accepte les filtres de periode', async ({ client }) => {
    const user = await createUser()
    const response = await client.get('/depenses?periode=week').loginAs(user)
    response.assertStatus(200)
  })

  test('accepte la pagination', async ({ client }) => {
    const user = await createUser()
    const response = await client.get('/depenses?page=1&range=10').loginAs(user)
    response.assertStatus(200)
  })
})

test.group('DepensesController — POST /depenses (store)', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  test('cree une depense et redirige', async ({ client, assert }) => {
    const user = await createUser()
    const cat = await createCategorie(user.id)
    const response = await client.post('/depenses').loginAs(user).form({
      date: '2026-07-01',
      libelle: 'Supermarché',
      montant: 75.5,
      categorieId: cat.id,
    })
    response.assertRedirectsTo('/depenses')
    const depense = await Depense.query().where('userId', user.id).where('libelle', 'Supermarché').first()
    assert.isNotNull(depense)
    assert.approximately(Number(depense!.montant), 75.5, 0.01)
  })

  test('echoue si categorieId manquant', async ({ client }) => {
    const user = await createUser()
    const response = await client.post('/depenses').loginAs(user).redirects(0).form({
      date: '2026-07-01',
      libelle: 'Test',
      montant: 10,
    })
    response.assertStatus(302)
  })

  test('echoue si montant <= 0', async ({ client }) => {
    const user = await createUser()
    const cat = await createCategorie(user.id)
    const response = await client.post('/depenses').loginAs(user).redirects(0).form({
      date: '2026-07-01',
      libelle: 'Test',
      montant: 0,
      categorieId: cat.id,
    })
    response.assertStatus(302)
  })

  test('type est derive de la categorie', async ({ client, assert }) => {
    const user = await createUser()
    const cat = await createCategorie(user.id, 'entree')
    await client.post('/depenses').loginAs(user).form({
      date: '2026-07-01',
      libelle: 'Salaire',
      montant: 2000,
      categorieId: cat.id,
    })
    const depense = await Depense.query().where('userId', user.id).where('libelle', 'Salaire').first()
    assert.equal(depense!.type, 'entree')
  })
})

test.group('DepensesController — POST /depenses/:id (update)', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  test('modifie une depense existante', async ({ client, assert }) => {
    const user = await createUser()
    const cat = await createCategorie(user.id)
    const depense = await createDepense(user.id, cat.id)
    const response = await client.post(`/depenses/${depense.id}`).loginAs(user).form({
      libelle: 'Modifie',
    })
    response.assertRedirectsTo('/depenses')
    await depense.refresh()
    assert.equal(depense.libelle, 'Modifie')
  })

  test('ne peut pas modifier la depense d un autre utilisateur', async ({ client }) => {
    const user1 = await createUser()
    const user2 = await createUser()
    const cat = await createCategorie(user1.id)
    const depense = await createDepense(user1.id, cat.id)
    const response = await client.post(`/depenses/${depense.id}`).loginAs(user2).form({
      libelle: 'Hack',
    })
    response.assertStatus(404)
  })
})

test.group('DepensesController — DELETE /depenses/:id (destroy)', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  test('supprime une depense', async ({ client, assert }) => {
    const user = await createUser()
    const cat = await createCategorie(user.id)
    const depense = await createDepense(user.id, cat.id)
    const response = await client.delete(`/depenses/${depense.id}`).loginAs(user)
    response.assertRedirectsTo('/depenses')
    const deleted = await Depense.find(depense.id)
    assert.isNull(deleted)
  })

  test('ne peut pas supprimer la depense d un autre utilisateur', async ({ client }) => {
    const user1 = await createUser()
    const user2 = await createUser()
    const cat = await createCategorie(user1.id)
    const depense = await createDepense(user1.id, cat.id)
    const response = await client.delete(`/depenses/${depense.id}`).loginAs(user2)
    response.assertStatus(404)
  })
})

test.group('DepensesController — POST /depenses/import/validate (storeBatch)', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  test('importe un lot de transactions valides', async ({ client, assert }) => {
    const user = await createUser()
    const cat = await createCategorie(user.id)
    const response = await client.post('/depenses/import/validate').loginAs(user).json({
      transactions: [
        {
          date: '2026-07-01',
          libelle: 'Import 1',
          montant: 10,
          type: 'sortie',
          categorieId: cat.id,
        },
        {
          date: '2026-07-02',
          libelle: 'Import 2',
          montant: 20,
          type: 'sortie',
        },
      ],
    })
    response.assertRedirectsTo('/depenses')
    const count = await Depense.query().where('userId', user.id).count('* as total')
    assert.equal(Number((count[0] as any).$extras.total), 2)
  })

  test('echoue si transactions est vide', async ({ client }) => {
    const user = await createUser()
    const response = await client.post('/depenses/import/validate').loginAs(user).redirects(0).json({
      transactions: [],
    })
    response.assertStatus(302)
  })
})
