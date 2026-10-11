import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'investment_transactions'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table
        .integer('support_id')
        .unsigned()
        .references('id')
        .inTable('investment_supports')
        .onDelete('CASCADE')
      table.enu('type', ['achat', 'vente']).notNullable()
      table.date('date').notNullable()
      table.decimal('quantity', 20, 8).notNullable()
      table.decimal('price', 20, 8).notNullable()
      table.decimal('fees', 20, 8).defaultTo(0)
      table.text('notes').nullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
