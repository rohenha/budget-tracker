import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from '#models/user'
import Categorie from '#models/categorie'

export default class Depense extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number

  @column()
  declare categorieId: number | null

  @column()
  declare libelle: string

  @column({ serialize: (v: string | null) => (v ? Number(v) : 0) })
  declare montant: number

  @column()
  declare type: 'entree' | 'sortie'

  @column()
  declare description: string | null

  @column.date()
  declare date: DateTime

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @belongsTo(() => Categorie)
  declare categorie: BelongsTo<typeof Categorie>
}
