import PageState from '~/components/page_state'

export default function Investissements() {
  return (
    <div className="flex flex-col gap-4">
      <h1>Investissements</h1>
      <p className="text-sm text-muted-foreground">Suivi des supports d&apos;investissement</p>
      <PageState empty={{ title: 'Aucun investissement', message: 'Ajoute ton premier support' }}>
        <div />
      </PageState>
    </div>
  )
}
