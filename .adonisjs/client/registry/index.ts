/* eslint-disable prettier/prettier */
import type { AdonisEndpoint } from '@tuyau/core/types'
import type { Registry } from './schema.d.ts'
import type { ApiDefinition } from './tree.d.ts'

const placeholder: any = {}

const routes = {
  'home': {
    methods: ["GET","HEAD"],
    pattern: '/',
    tokens: [{"old":"/","type":0,"val":"/","end":""}],
    types: placeholder as Registry['home']['types'],
  },
  'new_account.create': {
    methods: ["GET","HEAD"],
    pattern: '/signup',
    tokens: [{"old":"/signup","type":0,"val":"signup","end":""}],
    types: placeholder as Registry['new_account.create']['types'],
  },
  'new_account.store': {
    methods: ["POST"],
    pattern: '/signup',
    tokens: [{"old":"/signup","type":0,"val":"signup","end":""}],
    types: placeholder as Registry['new_account.store']['types'],
  },
  'session.create': {
    methods: ["GET","HEAD"],
    pattern: '/login',
    tokens: [{"old":"/login","type":0,"val":"login","end":""}],
    types: placeholder as Registry['session.create']['types'],
  },
  'session.store': {
    methods: ["POST"],
    pattern: '/login',
    tokens: [{"old":"/login","type":0,"val":"login","end":""}],
    types: placeholder as Registry['session.store']['types'],
  },
  'session.destroy': {
    methods: ["POST"],
    pattern: '/logout',
    tokens: [{"old":"/logout","type":0,"val":"logout","end":""}],
    types: placeholder as Registry['session.destroy']['types'],
  },
  'dashboard': {
    methods: ["GET","HEAD"],
    pattern: '/dashboard',
    tokens: [{"old":"/dashboard","type":0,"val":"dashboard","end":""}],
    types: placeholder as Registry['dashboard']['types'],
  },
  'budget': {
    methods: ["GET","HEAD"],
    pattern: '/categories',
    tokens: [{"old":"/categories","type":0,"val":"categories","end":""}],
    types: placeholder as Registry['budget']['types'],
  },
  'categories.store': {
    methods: ["POST"],
    pattern: '/categories',
    tokens: [{"old":"/categories","type":0,"val":"categories","end":""}],
    types: placeholder as Registry['categories.store']['types'],
  },
  'categories.update': {
    methods: ["PATCH"],
    pattern: '/categories/:id',
    tokens: [{"old":"/categories/:id","type":0,"val":"categories","end":""},{"old":"/categories/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['categories.update']['types'],
  },
  'categories.destroy': {
    methods: ["DELETE"],
    pattern: '/categories/:id',
    tokens: [{"old":"/categories/:id","type":0,"val":"categories","end":""},{"old":"/categories/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['categories.destroy']['types'],
  },
  'depenses': {
    methods: ["GET","HEAD"],
    pattern: '/depenses',
    tokens: [{"old":"/depenses","type":0,"val":"depenses","end":""}],
    types: placeholder as Registry['depenses']['types'],
  },
  'depenses.store': {
    methods: ["POST"],
    pattern: '/depenses',
    tokens: [{"old":"/depenses","type":0,"val":"depenses","end":""}],
    types: placeholder as Registry['depenses.store']['types'],
  },
  'depenses.update': {
    methods: ["PATCH"],
    pattern: '/depenses/:id',
    tokens: [{"old":"/depenses/:id","type":0,"val":"depenses","end":""},{"old":"/depenses/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['depenses.update']['types'],
  },
  'depenses.destroy': {
    methods: ["DELETE"],
    pattern: '/depenses/:id',
    tokens: [{"old":"/depenses/:id","type":0,"val":"depenses","end":""},{"old":"/depenses/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['depenses.destroy']['types'],
  },
  'depenses.import.upload': {
    methods: ["POST"],
    pattern: '/depenses/import',
    tokens: [{"old":"/depenses/import","type":0,"val":"depenses","end":""},{"old":"/depenses/import","type":0,"val":"import","end":""}],
    types: placeholder as Registry['depenses.import.upload']['types'],
  },
  'depenses.import': {
    methods: ["GET","HEAD"],
    pattern: '/depenses/import',
    tokens: [{"old":"/depenses/import","type":0,"val":"depenses","end":""},{"old":"/depenses/import","type":0,"val":"import","end":""}],
    types: placeholder as Registry['depenses.import']['types'],
  },
  'depenses.import.validate': {
    methods: ["POST"],
    pattern: '/depenses/import/validate',
    tokens: [{"old":"/depenses/import/validate","type":0,"val":"depenses","end":""},{"old":"/depenses/import/validate","type":0,"val":"import","end":""},{"old":"/depenses/import/validate","type":0,"val":"validate","end":""}],
    types: placeholder as Registry['depenses.import.validate']['types'],
  },
  'loans': {
    methods: ["GET","HEAD"],
    pattern: '/credits',
    tokens: [{"old":"/credits","type":0,"val":"credits","end":""}],
    types: placeholder as Registry['loans']['types'],
  },
  'loans.show': {
    methods: ["GET","HEAD"],
    pattern: '/credits/:id',
    tokens: [{"old":"/credits/:id","type":0,"val":"credits","end":""},{"old":"/credits/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['loans.show']['types'],
  },
  'loans.store': {
    methods: ["POST"],
    pattern: '/credits',
    tokens: [{"old":"/credits","type":0,"val":"credits","end":""}],
    types: placeholder as Registry['loans.store']['types'],
  },
  'loans.update': {
    methods: ["PATCH"],
    pattern: '/credits/:id',
    tokens: [{"old":"/credits/:id","type":0,"val":"credits","end":""},{"old":"/credits/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['loans.update']['types'],
  },
  'loans.destroy': {
    methods: ["DELETE"],
    pattern: '/credits/:id',
    tokens: [{"old":"/credits/:id","type":0,"val":"credits","end":""},{"old":"/credits/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['loans.destroy']['types'],
  },
  'investissements': {
    methods: ["GET","HEAD"],
    pattern: '/investissements',
    tokens: [{"old":"/investissements","type":0,"val":"investissements","end":""}],
    types: placeholder as Registry['investissements']['types'],
  },
  'cryptos': {
    methods: ["GET","HEAD"],
    pattern: '/cryptos',
    tokens: [{"old":"/cryptos","type":0,"val":"cryptos","end":""}],
    types: placeholder as Registry['cryptos']['types'],
  },
} as const satisfies Record<string, AdonisEndpoint>

export { routes }

export const registry = {
  routes,
  $tree: {} as ApiDefinition,
}

declare module '@tuyau/core/types' {
  export interface UserRegistry {
    routes: typeof routes
    $tree: ApiDefinition
  }
}
