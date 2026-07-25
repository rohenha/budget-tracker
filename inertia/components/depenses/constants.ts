import { type Categorie } from '~/components/budget/constants'

export type Depense = {
  id: number
  userId: number
  categorieId: number | null
  libelle: string
  montant: number
  type: 'entree' | 'sortie'
  description: string | null
  date: string
  categorie: Categorie | null
}
