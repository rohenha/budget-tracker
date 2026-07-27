import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'home': { paramsTuple?: []; params?: {} }
    'new_account.create': { paramsTuple?: []; params?: {} }
    'new_account.store': { paramsTuple?: []; params?: {} }
    'session.create': { paramsTuple?: []; params?: {} }
    'session.store': { paramsTuple?: []; params?: {} }
    'session.destroy': { paramsTuple?: []; params?: {} }
    'dashboard': { paramsTuple?: []; params?: {} }
    'budget': { paramsTuple?: []; params?: {} }
    'categories.store': { paramsTuple?: []; params?: {} }
    'categories.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'categories.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'depenses': { paramsTuple?: []; params?: {} }
    'depenses.store': { paramsTuple?: []; params?: {} }
    'depenses.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'depenses.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'depenses.import.upload': { paramsTuple?: []; params?: {} }
    'depenses.import': { paramsTuple?: []; params?: {} }
    'depenses.import.validate': { paramsTuple?: []; params?: {} }
    'credits': { paramsTuple?: []; params?: {} }
    'investissements': { paramsTuple?: []; params?: {} }
    'cryptos': { paramsTuple?: []; params?: {} }
  }
  GET: {
    'home': { paramsTuple?: []; params?: {} }
    'new_account.create': { paramsTuple?: []; params?: {} }
    'session.create': { paramsTuple?: []; params?: {} }
    'dashboard': { paramsTuple?: []; params?: {} }
    'budget': { paramsTuple?: []; params?: {} }
    'depenses': { paramsTuple?: []; params?: {} }
    'depenses.import': { paramsTuple?: []; params?: {} }
    'credits': { paramsTuple?: []; params?: {} }
    'investissements': { paramsTuple?: []; params?: {} }
    'cryptos': { paramsTuple?: []; params?: {} }
  }
  HEAD: {
    'home': { paramsTuple?: []; params?: {} }
    'new_account.create': { paramsTuple?: []; params?: {} }
    'session.create': { paramsTuple?: []; params?: {} }
    'dashboard': { paramsTuple?: []; params?: {} }
    'budget': { paramsTuple?: []; params?: {} }
    'depenses': { paramsTuple?: []; params?: {} }
    'depenses.import': { paramsTuple?: []; params?: {} }
    'credits': { paramsTuple?: []; params?: {} }
    'investissements': { paramsTuple?: []; params?: {} }
    'cryptos': { paramsTuple?: []; params?: {} }
  }
  POST: {
    'new_account.store': { paramsTuple?: []; params?: {} }
    'session.store': { paramsTuple?: []; params?: {} }
    'session.destroy': { paramsTuple?: []; params?: {} }
    'categories.store': { paramsTuple?: []; params?: {} }
    'depenses.store': { paramsTuple?: []; params?: {} }
    'depenses.import.upload': { paramsTuple?: []; params?: {} }
    'depenses.import.validate': { paramsTuple?: []; params?: {} }
  }
  PATCH: {
    'categories.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'depenses.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  DELETE: {
    'categories.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'depenses.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}