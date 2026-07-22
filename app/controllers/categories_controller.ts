import { DateTime } from 'luxon'
import db from '@adonisjs/lucid/services/db'
import Categorie from '#models/categorie'
import { createCategorieValidator, updateCategorieValidator } from '#validators/categorie'
import type { HttpContext } from '@adonisjs/core/http'
type CategorySpending = {
  categorieId: number
  label: string
  icon: string
  color: string
  slug: string
  type: 'entree' | 'sortie'
  budget: number | null
  spent: number
}

export default class CategoriesController {
  async index({ inertia, auth }: HttpContext) {
    const user = auth.user!
    const categories = await Categorie.query().where('userId', user.id).orderBy('type', 'asc')

    const now = DateTime.now()
    const startOfMonth = now.startOf('month').toSQLDate()
    const endOfMonth = now.endOf('month').toSQLDate()

    const rows = await db
      .from('depenses')
      .select('categorie_id')
      .sum('montant as spent')
      .where('user_id', user.id)
      .whereBetween('date', [startOfMonth!, endOfMonth!])
      .groupBy('categorie_id')

    const categorySpending = [] as CategorySpending[]
    const categoryEntry = [] as CategorySpending[]
    categories.forEach((c) => {
      const row = rows.find((r: any) => r.categorie_id === c.id)
      const data = {
        categorieId: c.id,
        label: c.label,
        icon: c.icon ?? '',
        color: c.color ?? '',
        type: c.type,
        slug: c.slug,
        budget: c.budget !== null ? Number(c.budget) : null,
        spent: row ? Number(row.spent) : 0,
      }

      if (c.type === 'entree') {
        categoryEntry.push(data)
      } else {
        categorySpending.push(data)
      }
    })

    return inertia.render('budget/index', {
      categorySpending,
      categoryEntry,
    })
  }

  async store({ request, response, auth, session }: HttpContext) {
    const user = auth.user!
    const payload = await request.validateUsing(createCategorieValidator)
    const slug = payload.slug ?? (await Categorie.generateSlug(payload.label))
    await Categorie.create({
      userId: user.id,
      label: payload.label,
      type: payload.type,
      slug,
      icon: payload.icon,
      budget: payload.budget ?? null,
      color: payload.color,
    })
    session.flash('success', 'Catégorie créée avec succès')
    response.redirect().toRoute('budget')
  }

  async update({ request, response, auth, params, session }: HttpContext) {
    const user = auth.user!
    const categorie = await Categorie.query()
      .where('id', params.id)
      .where('userId', user.id)
      .firstOrFail()
    const payload = await request.validateUsing(updateCategorieValidator)
    const slug =
      payload.slug ??
      (payload.label ? await Categorie.generateSlug(payload.label, categorie.id) : undefined)
    categorie.merge({
      ...(payload.label !== undefined ? { label: payload.label } : {}),
      ...(payload.type !== undefined ? { type: payload.type } : {}),
      ...(slug !== undefined ? { slug } : {}),
      ...(payload.icon !== undefined ? { icon: payload.icon } : {}),
      ...(payload.budget !== undefined ? { budget: payload.budget } : {}),
      ...(payload.color !== undefined ? { color: payload.color } : {}),
    })
    await categorie.save()
    session.flash('success', 'Catégorie modifiée avec succès')
    response.redirect().toRoute('budget')
  }

  async destroy({ response, auth, params, session }: HttpContext) {
    const user = auth.user!
    const categorie = await Categorie.query()
      .where('id', params.id)
      .where('userId', user.id)
      .firstOrFail()
    const autre = await Categorie.query()
      .where('userId', user.id)
      .where('slug', 'autre')
      .firstOrFail()
    if (categorie.id === autre.id) {
      return response.redirect().back()
    }
    await categorie.delete()
    session.flash('success', 'Catégorie supprimée avec succès')
    response.redirect().toRoute('budget')
  }
}
