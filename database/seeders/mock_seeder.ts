import { DateTime } from 'luxon'
import User from '#models/user'
import Categorie from '#models/categorie'
import Depense from '#models/depense'
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

    const categories: Record<string, Categorie> = {}

    for (const cat of categoriesData) {
      const slug = await Categorie.generateSlug(cat.label)
      const existing = await Categorie.query().where('slug', slug).where('userId', user.id).first()
      if (existing) {
        categories[cat.label] = existing
      } else {
        const created = await Categorie.create({
          userId: user.id,
          label: cat.label,
          slug,
          icon: cat.icon,
          budget: cat.budget || null,
          color: cat.color,
        })
        categories[cat.label] = created
      }
    }

    const now = DateTime.now()
    const depenses = [
      {
        libelle: 'Courses Carrefour',
        montant: 87.5,
        type: 'sortie' as const,
        date: now.minus({ months: 1, days: 2 }),
        cat: 'Alimentation',
      },
      {
        libelle: 'Loyer juillet',
        montant: 1150,
        type: 'sortie' as const,
        date: now.minus({ months: 1, days: 5 }),
        cat: 'Logement',
      },
      {
        libelle: 'Pass Navigo',
        montant: 84.1,
        type: 'sortie' as const,
        date: now.minus({ months: 1, days: 1 }),
        cat: 'Transport',
      },
      {
        libelle: 'Billet concert',
        montant: 45,
        type: 'sortie' as const,
        date: now.minus({ months: 1, days: 10 }),
        cat: 'Loisirs',
      },
      {
        libelle: 'Pharmacie',
        montant: 12.3,
        type: 'sortie' as const,
        date: now.minus({ months: 1, days: 8 }),
        cat: 'Santé',
      },
      {
        libelle: 'Salaire juillet',
        montant: 3200,
        type: 'entree' as const,
        date: now.minus({ months: 1, days: 28 }),
        cat: 'Salaire',
      },
      {
        libelle: 'Mission consulting',
        montant: 800,
        type: 'entree' as const,
        date: now.minus({ months: 1, days: 15 }),
        cat: 'Freelance',
      },
      {
        libelle: 'Auchan',
        montant: 62.3,
        type: 'sortie' as const,
        date: now.minus({ months: 1, days: 16 }),
        cat: 'Alimentation',
      },
      {
        libelle: 'Total énergie',
        montant: 138.6,
        type: 'sortie' as const,
        date: now.minus({ months: 1, days: 12 }),
        cat: 'Logement',
      },
      {
        libelle: 'Uber',
        montant: 18.5,
        type: 'sortie' as const,
        date: now.minus({ months: 1, days: 20 }),
        cat: 'Transport',
      },
      {
        libelle: 'Netflix',
        montant: 13.99,
        type: 'sortie' as const,
        date: now.minus({ months: 1, days: 7 }),
        cat: 'Loisirs',
      },
      {
        libelle: 'Mutuelle',
        montant: 52.8,
        type: 'sortie' as const,
        date: now.minus({ months: 1, days: 3 }),
        cat: 'Santé',
      },
      {
        libelle: 'Cours du soir',
        montant: 89,
        type: 'sortie' as const,
        date: now.minus({ months: 1, days: 14 }),
        cat: 'Éducation',
      },

      {
        libelle: 'Leclerc',
        montant: 105.2,
        type: 'sortie' as const,
        date: now.minus({ days: 3 }),
        cat: 'Alimentation',
      },
      {
        libelle: 'Loyer août',
        montant: 1150,
        type: 'sortie' as const,
        date: now.minus({ days: 5 }),
        cat: 'Logement',
      },
      {
        libelle: 'Pass Navigo',
        montant: 84.1,
        type: 'sortie' as const,
        date: now.minus({ days: 1 }),
        cat: 'Transport',
      },
      {
        libelle: 'Cinéma',
        montant: 12.5,
        type: 'sortie' as const,
        date: now.minus({ days: 2 }),
        cat: 'Loisirs',
      },
      {
        libelle: 'Médicaments',
        montant: 8.9,
        type: 'sortie' as const,
        date: now.minus({ days: 6 }),
        cat: 'Santé',
      },
      {
        libelle: 'Formation en ligne',
        montant: 29.99,
        type: 'sortie' as const,
        date: now.minus({ days: 4 }),
        cat: 'Éducation',
      },
      {
        libelle: 'Salaire septembre (avance)',
        montant: 3200,
        type: 'entree' as const,
        date: now.minus({ days: 10 }),
        cat: 'Salaire',
      },
      {
        libelle: 'Mission Freelance',
        montant: 1200,
        type: 'entree' as const,
        date: now.minus({ days: 7 }),
        cat: 'Freelance',
      },
      {
        libelle: "Monop'",
        montant: 23.4,
        type: 'sortie' as const,
        date: now.minus({ days: 8 }),
        cat: 'Alimentation',
      },
      {
        libelle: 'EDF',
        montant: 95.2,
        type: 'sortie' as const,
        date: now.minus({ days: 12 }),
        cat: 'Logement',
      },
      {
        libelle: 'Essence',
        montant: 65,
        type: 'sortie' as const,
        date: now.minus({ days: 9 }),
        cat: 'Transport',
      },
      {
        libelle: 'Spotify',
        montant: 10.99,
        type: 'sortie' as const,
        date: now.minus({ days: 15 }),
        cat: 'Loisirs',
      },

      {
        libelle: 'Boulangerie',
        montant: 3.5,
        type: 'sortie' as const,
        date: now,
        cat: 'Alimentation',
      },
      {
        libelle: 'Restaurant midi',
        montant: 18.9,
        type: 'sortie' as const,
        date: now,
        cat: 'Alimentation',
      },
      {
        libelle: 'Prime mission',
        montant: 500,
        type: 'entree' as const,
        date: now,
        cat: 'Freelance',
      },
    ]

    for (const d of depenses) {
      const cat = categories[d.cat]
      const existing = await Depense.query()
        .where('libelle', d.libelle)
        .where('userId', user.id)
        .where('date', d.date.toISODate()!)
        .first()
      if (!existing) {
        await Depense.create({
          userId: user.id,
          categorieId: cat?.id ?? null,
          libelle: d.libelle,
          montant: d.montant,
          type: d.type,
          description: null,
          date: d.date,
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

    console.log('✅ Mock data seeded: user, 8 categories, 28 depenses, 2 loans')
  }
}
