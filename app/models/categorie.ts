import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from '#models/user'
import slug from 'slug'

export default class Categorie extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number

  @column()
  declare label: string

  @column()
  declare slug: string

  @column()
  declare icon: string

  @column({ serialize: (v: string | null) => (v ? Number(v) : null) })
  declare budget: number | null

  @column()
  declare type: 'entree' | 'sortie'

  @column()
  declare color: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  static async generateSlug(label: string, excludeId?: number): Promise<string> {
    let baseSlug = slug(label.toLowerCase())
    if (!baseSlug) baseSlug = 'categorie'
    let candidate = baseSlug
    let counter = 1
    while (true) {
      const existing = await Categorie.query()
        .where('slug', candidate)
        .if(excludeId, (q) => q.whereNot('id', excludeId!))
        .first()
      if (!existing) return candidate
      candidate = `${baseSlug}-${counter}`
      counter++
    }
  }
}
