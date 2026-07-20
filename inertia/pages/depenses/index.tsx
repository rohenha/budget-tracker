import AuthLayout from '~/layouts/auth'
import PageState from '~/components/page_state'

export default function Depenses() {
  return (
    <div className="flex flex-col gap-4">
      <h1>Dépenses</h1>
      <p className="text-sm text-muted-foreground">Suivi des dépenses et revenus</p>
      <PageState
        empty={{ title: 'Aucune dépense', message: 'Ajoute une dépense ou importe un fichier CSV' }}
      >
        <div />
      </PageState>
    </div>
  )
}

Depenses.layout = AuthLayout
