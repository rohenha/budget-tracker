import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'loans'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.integer('user_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE')
      table.string('name').notNullable()
      table.decimal('borrowed_amount', 15, 2).notNullable()
      table.decimal('down_payment', 15, 2).notNullable().defaultTo(0)
      table.decimal('interest_rate', 5, 3).notNullable()
      table.integer('duration_months').notNullable()
      table.enu('status', ['active', 'paid']).notNullable().defaultTo('active')
      table.date('start_date').notNullable()
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
