import { DateTime } from 'luxon'
import Depense from '#models/depense'
import Categorie from '#models/categorie'
import Database from '@adonisjs/lucid/services/db'
import {
  indexDepenseValidator,
  createDepenseValidator,
  updateDepenseValidator,
  importBatchValidator,
} from '#validators/depense'
import type { HttpContext } from '@adonisjs/core/http'

export default class DepensesController {
  async index({ inertia, auth, request }: HttpContext) {
    const user = auth.user!
    let {
      periode = 'month',
      dateDebut,
      dateFin,
      category = '',
      page = 1,
      range = 25,
    } = await request.validateUsing(indexDepenseValidator)

    const now = DateTime.now()
    let startDate: string
    let endDate: string

    switch (periode) {
      case 'today':
        startDate = now.startOf('day').toSQLDate()!
        endDate = now.endOf('day').toSQLDate()!
        break
      case 'week':
        startDate = now.startOf('week').toSQLDate()!
        endDate = now.endOf('week').toSQLDate()!
        break
      case 'custom':
        startDate = dateDebut ?? now.startOf('month').toSQLDate()!
        endDate = dateFin ?? now.endOf('month').toSQLDate()!
        break
      case 'month':
      default:
        startDate = now.startOf('month').toSQLDate()!
        endDate = now.endOf('month').toSQLDate()!
        break
    }

    const categories = await Categorie.query().where('userId', user.id).orderBy('createdAt', 'asc')

    let categoryId = null
    if (category) {
      const categoryItem = categories.find((cat) => cat.slug === category)
      if (categoryItem) {
        categoryId = categoryItem.id
      }
    }

    const query = Depense.query()
      .where('userId', user.id)
      .whereBetween('date', [startDate, endDate])
      .preload('categorie')
      .orderBy('date', 'desc')

    if (categoryId) {
      query.where('categorieId', categoryId)
    }

    const depenses = await query.paginate(page, range)

    depenses.baseUrl('/depenses')

    const paginationMeta = depenses.getMeta()
    const pagination = {
      previousPage: paginationMeta.previousPageUrl,
      currentPage: paginationMeta.currentPage,
      nextPage: paginationMeta.nextPageUrl,
      links: depenses.getUrlsForRange(1, depenses.lastPage),
    }

    return inertia.render('depenses/index', {
      depenses: depenses.serialize() as any,
      categories: categories.map((c) => c.serialize()) as any,
      pagination,
      filters: { periode, dateDebut: startDate, dateFin: endDate, category, range },
    })
  }

  async store({ request, response, auth, session }: HttpContext) {
    const user = auth.user!
    const payload = await request.validateUsing(createDepenseValidator)
    const categorie = await Categorie.query()
      .where('id', payload.categorieId)
      .where('userId', user.id)
      .firstOrFail()
    await Depense.create({
      userId: user.id,
      categorieId: payload.categorieId,
      libelle: payload.libelle,
      montant: payload.montant,
      type: categorie.type,
      description: payload.description ?? null,
      date: DateTime.fromJSDate(payload.date.toJSDate()),
    })
    session.flash('success', 'Dépense ajoutée')
    response.redirect().toRoute('depenses')
  }

  async storeBatch({ request, response, auth, session }: HttpContext) {
    const user = auth.user!
    const payload = await request.validateUsing(importBatchValidator)

    const userCategories = await Categorie.query().where('userId', user.id)
    const validCategoryIds = new Set(userCategories.map((c) => c.id))

    await Database.transaction(async (trx) => {
      for (const tx of payload.transactions) {
        let type: 'entree' | 'sortie' = tx.type
        if (tx.categorieId !== undefined && tx.categorieId !== null) {
          if (!validCategoryIds.has(tx.categorieId)) {
            throw new Error(`Catégorie ${tx.categorieId} n'appartient pas à l'utilisateur`)
          }
          const cat = userCategories.find((c) => c.id === tx.categorieId)!
          type = cat.type
        }
        await Depense.create(
          {
            userId: user.id,
            categorieId: tx.categorieId ?? null,
            libelle: tx.libelle,
            montant: tx.montant,
            type,
            description: tx.description ?? null,
            date: DateTime.fromJSDate(tx.date.toJSDate()),
          },
          { client: trx }
        )
      }
    })

    session.flash('success', `${payload.transactions.length} dépenses importées`)
    response.redirect().toRoute('depenses')
  }

  async update({ request, response, auth, params, session }: HttpContext) {
    const user = auth.user!
    const depense = await Depense.query()
      .where('id', params.id)
      .where('userId', user.id)
      .firstOrFail()
    const payload = await request.validateUsing(updateDepenseValidator)

    if (payload.date !== undefined) depense.date = DateTime.fromJSDate(payload.date.toJSDate())
    if (payload.libelle !== undefined) depense.libelle = payload.libelle
    if (payload.montant !== undefined) depense.montant = payload.montant
    if (payload.type !== undefined) depense.type = payload.type
    if (payload.categorieId !== undefined) depense.categorieId = payload.categorieId
    if (payload.description !== undefined) depense.description = payload.description

    await depense.save()
    session.flash('success', 'Dépense modifiée')
    response.redirect().toRoute('depenses')
  }

  async destroy({ response, auth, params, session }: HttpContext) {
    const user = auth.user!
    const depense = await Depense.query()
      .where('id', params.id)
      .where('userId', user.id)
      .firstOrFail()
    await depense.delete()
    session.flash('success', 'Dépense supprimée')
    response.redirect().toRoute('depenses')
  }
}
