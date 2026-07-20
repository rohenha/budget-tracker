import { Button } from '~/components/ui/button'
import { Link } from '@adonisjs/inertia/react'

export default function Home() {
  return (
    <div className="flex flex-col gap-16 px-4 pb-16">
      <section className="flex flex-col items-center gap-4 pt-16 text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Pilotez votre budget, maîtrisez vos finances
        </h1>
        <p className="max-w-lg text-sm text-muted-foreground">
          Budget Tracker vous aide à suivre vos dépenses, gérer vos crédits, optimiser vos
          investissements — le tout dans un tableau de bord clair et sécurisé.
        </p>
        <div className="flex gap-3">
          <Button render={<Link route="new_account.create" />}>Créer un compte</Button>
          <Button variant="outline" render={<Link route="session.create" />}>
            Se connecter
          </Button>
        </div>
      </section>

      <section className="mx-auto grid max-w-2xl gap-6 sm:grid-cols-2">
        <div className="rounded-lg border p-4">
          <h2 className="mb-1 text-sm font-semibold">Tableau de bord</h2>
          <p className="text-xs text-muted-foreground">
            Vue synthétique de votre patrimoine : soldes bancaires, investissements, cryptos et
            crédits.
          </p>
        </div>
        <div className="rounded-lg border p-4">
          <h2 className="mb-1 text-sm font-semibold">Dépenses</h2>
          <p className="text-xs text-muted-foreground">
            Suivez et catégorisez vos dépenses mensuelles pour mieux visualiser votre cash-flow.
          </p>
        </div>
        <div className="rounded-lg border p-4">
          <h2 className="mb-1 text-sm font-semibold">Budget</h2>
          <p className="text-xs text-muted-foreground">
            Fixez des limites par catégorie et recevez des alertes quand vous approchez du plafond.
          </p>
        </div>
        <div className="rounded-lg border p-4">
          <h2 className="mb-1 text-sm font-semibold">Investissements</h2>
          <p className="text-xs text-muted-foreground">
            Pilotez vos placements et suivez la performance de votre portefeuille en temps réel.
          </p>
        </div>
      </section>
    </div>
  )
}
