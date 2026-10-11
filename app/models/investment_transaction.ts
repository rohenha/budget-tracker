import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import InvestmentSupport from '#models/investment_support'

export default class InvestmentTransaction extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare supportId: number

  @column()
  declare type: 'achat' | 'vente'

  @column.date()
  declare date: DateTime

  @column({ serialize: (v: string) => Number(v) })
  declare quantity: number

  @column({ serialize: (v: string) => Number(v) })
  declare price: number

  @column({ serialize: (v: string) => Number(v) })
  declare fees: number

  @column()
  declare notes: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @belongsTo(() => InvestmentSupport)
  declare support: BelongsTo<typeof InvestmentSupport>
}
