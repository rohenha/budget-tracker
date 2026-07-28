import MockSeeder from './mock_seeder.js'

export default class DepenseMockSeeder {
  async run() {
    await new MockSeeder().run()
  }
}
