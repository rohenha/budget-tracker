import User from '#models/user'
import Categorie from '#models/categorie'
import { signupValidator } from '#validators/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class NewAccountController {
  async create({ inertia }: HttpContext) {
    return inertia.render('auth/signup', {})
  }

  async store({ request, response, auth }: HttpContext) {
    const payload = await request.validateUsing(signupValidator)
    const user = await User.create({ ...payload })
    await this.ensureDefaultCategorie(user.id)
    await auth.use('web').login(user)
    response.redirect().toRoute('dashboard')
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
