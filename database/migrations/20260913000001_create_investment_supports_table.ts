import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'investment_supports'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table
        .integer('user_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
      table.string('symbol').notNullable()
      table.string('name').notNullable()
      table.enu('type', ['PEA', 'AV', 'CTO']).notNullable()
      table.string('storage_location').notNullable()
      table.decimal('annual_fees', 5, 2).notNullable().defaultTo(0)
      table.text('description').nullable()
      table.string('external_link').nullable()
      table.decimal('last_known_price', 15, 2).nullable()
      table.timestamp('last_price_at').nullable()
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
