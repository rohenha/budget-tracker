import PageState from '~/components/page_state'

export default function Cryptos() {
  return (
    <div className="flex flex-col gap-4">
      <h1>Cryptos</h1>
      <p className="text-sm text-muted-foreground">Suivi des cryptomonnaies</p>
      <PageState empty={{ title: 'Aucune crypto', message: 'Ajoute ta première crypto' }}>
        <div />
      </PageState>
    </div>
  )
}
