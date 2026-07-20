import Categorie from '#models/categorie'
import { createCategorieValidator, updateCategorieValidator } from '#validators/categorie'
import type { HttpContext } from '@adonisjs/core/http'

export default class CategoriesController {
  async index({ inertia, auth }: HttpContext) {
    const user = auth.user!
    await this.ensureDefaultCategorie(user.id)
    const categories = await Categorie.query()
      .where('userId', user.id)
      .orderBy('createdAt', 'asc')
    return inertia.render('budget/index', { categories: categories.map((c) => c.serialize()) as any })
  }

  async store({ request, response, auth }: HttpContext) {
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
    response.redirect().toRoute('budget')
  }

  async update({ request, response, auth, params }: HttpContext) {
    const user = auth.user!
    const categorie = await Categorie.query()
      .where('id', params.id)
      .where('userId', user.id)
      .firstOrFail()
    const payload = await request.validateUsing(updateCategorieValidator)
    const slug =
      payload.slug ?? (payload.label ? await Categorie.generateSlug(payload.label, categorie.id) : undefined)
    categorie.merge({
      ...(payload.label !== undefined ? { label: payload.label } : {}),
      ...(slug !== undefined ? { slug } : {}),
      ...(payload.icon !== undefined ? { icon: payload.icon } : {}),
      ...(payload.budget !== undefined ? { budget: payload.budget } : {}),
      ...(payload.color !== undefined ? { color: payload.color } : {}),
    })
    await categorie.save()
    response.redirect().toRoute('budget')
  }

  async destroy({ response, auth, params }: HttpContext) {
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
    response.redirect().toRoute('budget')
  }

  private async ensureDefaultCategorie(userId: number) {
    const exists = await Categorie.query().where('userId', userId).where('slug', 'autre').first()
    if (!exists) {
      await Categorie.create({
        userId,
        label: 'Autre',
        slug: 'autre',
        icon: 'Circle',
        color: '#6b7280',
      })
    }
  }
}
