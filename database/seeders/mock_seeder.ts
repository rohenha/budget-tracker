import { DateTime } from 'luxon'
import User from '#models/user'
import Categorie from '#models/categorie'
import Loan from '#models/loan'

export default class MockSeeder {
  async run() {
    const user = await User.firstOrCreate(
      { email: 'demo@example.com' },
      {
        fullName: 'Demo User',
        password: 'password',
      }
    )

    const categoriesData = [
      { label: 'Alimentation', icon: 'ShoppingCart', budget: 600, color: '#ef4444' },
      { label: 'Logement', icon: 'Home', budget: 1200, color: '#3b82f6' },
      { label: 'Transport', icon: 'Car', budget: 300, color: '#f59e0b' },
      { label: 'Loisirs', icon: 'Gamepad2', budget: 200, color: '#8b5cf6' },
      { label: 'Santé', icon: 'Heart', budget: 150, color: '#ec4899' },
      { label: 'Éducation', icon: 'BookOpen', budget: 100, color: '#14b8a6' },
      { label: 'Salaire', icon: 'Briefcase', budget: 0, color: '#22c55e' },
      { label: 'Freelance', icon: 'Laptop', budget: 0, color: '#6366f1' },
    ]

    for (const cat of categoriesData) {
      const slug = await Categorie.generateSlug(cat.label)
      const existing = await Categorie.query().where('slug', slug).where('userId', user.id).first()
      if (!existing) {
        await Categorie.create({
          userId: user.id,
          label: cat.label,
          slug,
          icon: cat.icon,
          budget: cat.budget || null,
          color: cat.color,
        })
      }
    }

    const loansData = [
      {
        name: 'Prêt immobilier RP',
        borrowedAmount: 250000,
        downPayment: 50000,
        interestRate: 3.5,
        durationMonths: 300,
        status: 'active' as const,
        startDate: DateTime.fromISO('2022-01-15'),
      },
      {
        name: 'Prêt auto Tesla',
        borrowedAmount: 35000,
        downPayment: 5000,
        interestRate: 4.2,
        durationMonths: 60,
        status: 'active' as const,
        startDate: DateTime.fromISO('2024-06-01'),
      },
    ]

    for (const loan of loansData) {
      const existing = await Loan.query()
        .where('name', loan.name)
        .where('userId', user.id)
        .first()
      if (!existing) {
        await Loan.create({
          userId: user.id,
          ...loan,
        })
      }
    }

    console.log('✅ Mock data seeded: user, categories, 2 loans')
  }
}
