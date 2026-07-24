import { DateTime } from 'luxon'
import Depense from '#models/depense'
import Categorie from '#models/categorie'
import {
  indexDepenseValidator,
  createDepenseValidator,
  updateDepenseValidator,
} from '#validators/depense'
import type { HttpContext } from '@adonisjs/core/http'

export default class DepensesController {
  async index({ inertia, auth, request }: HttpContext) {
    const user = auth.user!
    let { periode, dateDebut, dateFin } = await request.validateUsing(indexDepenseValidator)

    const now = DateTime.now()
    let startDate: string
    let endDate: string

    if (!periode) {
      periode = 'month'
    }

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

    const depenses = await Depense.query()
      .where('userId', user.id)
      .whereBetween('date', [startDate, endDate])
      .preload('categorie')
      .orderBy('date', 'desc')
      .paginate(request.input('page', 1), 20)

    const categories = await Categorie.query().where('userId', user.id).orderBy('createdAt', 'asc')

    return inertia.render('depenses/index', {
      depenses: depenses.serialize() as any,
      categories: categories.map((c) => c.serialize()) as any,
      filters: { periode, dateDebut: startDate, dateFin: endDate },
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
      date: DateTime.fromISO(payload.date),
    })
    session.flash('success', 'Dépense ajoutée')
    response.redirect().toRoute('depenses')
  }

  async update({ request, response, auth, params, session }: HttpContext) {
    const user = auth.user!
    const depense = await Depense.query()
      .where('id', params.id)
      .where('userId', user.id)
      .firstOrFail()
    const payload = await request.validateUsing(updateDepenseValidator)

    if (payload.date !== undefined) depense.date = DateTime.fromISO(payload.date)
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
