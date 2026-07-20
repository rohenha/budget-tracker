import Categorie from '#models/categorie'
import { createCategorieValidator, updateCategorieValidator } from '#validators/categorie'
import type { HttpContext } from '@adonisjs/core/http'

export default class CategoriesController {
  async index({ inertia, auth }: HttpContext) {
    const user = auth.user!
    const categories = await Categorie.query().where('userId', user.id).orderBy('createdAt', 'asc')
    return inertia.render('budget/index', {
      categories: categories.map((c) => c.serialize()) as any,
    })
  }

  async store({ request, response, auth, session }: HttpContext) {
    const user = auth.user!
    const payload = await request.validateUsing(createCategorieValidator)
    const slug = payload.slug ?? (await Categorie.generateSlug(payload.label))
    await Categorie.create({
      userId: user.id,
      label: payload.label,
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
