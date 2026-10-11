import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from '#models/user'

export default class InvestmentSupport extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number

  @column()
  declare symbol: string

  @column()
  declare name: string

  @column()
  declare type: 'PEA' | 'AV' | 'CTO'

  @column()
  declare storageLocation: string

  @column({ serialize: (v: string | null) => (v ? Number(v) : 0) })
  declare annualFees: number

  @column()
  declare description: string | null

  @column()
  declare externalLink: string | null

  @column({ serialize: (v: string | null) => (v ? Number(v) : null) })
  declare lastKnownPrice: number | null

  @column.dateTime()
  declare lastPriceAt: DateTime | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>
}
