import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'categories'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.integer('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE')
      table.string('label').notNullable()
      table.string('slug').notNullable().unique()
      table.string('icon').notNullable().defaultTo('Circle')
      table.decimal('budget', 10, 2).nullable()
      table.string('color', 7).notNullable().defaultTo('#6366f1')

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
