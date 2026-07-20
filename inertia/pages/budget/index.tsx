import AuthLayout from '~/layouts/auth'
import PageState from '~/components/page_state'

export default function Budget() {
  return (
    <div className="flex flex-col gap-4">
      <h1>Budget</h1>
      <p className="text-sm text-muted-foreground">Gestion des catégories et budget prévisionnel</p>
      <PageState
        empty={{
          title: 'Aucune catégorie',
          message: 'Configure tes premières catégories de dépenses',
        }}
      >
        <div />
      </PageState>
    </div>
  )
}

Budget.layout = AuthLayout
