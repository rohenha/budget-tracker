import AuthLayout from '~/layouts/auth'
import PageState from '~/components/page_state'

export default function Credits() {
  return (
    <div className="flex flex-col gap-4">
      <h1>Crédits</h1>
      <p className="text-sm text-muted-foreground">Gestion des crédits immobiliers</p>
      <PageState empty={{ title: 'Aucun crédit', message: 'Ajoute ton premier crédit immobilier' }}>
        <div />
      </PageState>
    </div>
  )
}

Credits.layout = AuthLayout
