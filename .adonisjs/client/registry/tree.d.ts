/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  home: typeof routes['home']
  newAccount: {
    create: typeof routes['new_account.create']
    store: typeof routes['new_account.store']
  }
  session: {
    create: typeof routes['session.create']
    store: typeof routes['session.store']
    destroy: typeof routes['session.destroy']
  }
  dashboard: typeof routes['dashboard']
  budget: typeof routes['budget']
  categories: {
    store: typeof routes['categories.store']
    update: typeof routes['categories.update']
    destroy: typeof routes['categories.destroy']
  }
  depenses: typeof routes['depenses'] & {
    store: typeof routes['depenses.store']
    update: typeof routes['depenses.update']
    destroy: typeof routes['depenses.destroy']
    import: typeof routes['depenses.import'] & {
      upload: typeof routes['depenses.import.upload']
      validate: typeof routes['depenses.import.validate']
    }
  }
  loans: typeof routes['loans'] & {
    show: typeof routes['loans.show']
    store: typeof routes['loans.store']
    update: typeof routes['loans.update']
    destroy: typeof routes['loans.destroy']
  }
  investissements: typeof routes['investissements']
  cryptos: typeof routes['cryptos']
}
