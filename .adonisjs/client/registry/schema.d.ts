/* eslint-disable prettier/prettier */
/// <reference path="../manifest.d.ts" />

import type { ExtractBody, ExtractErrorResponse, ExtractQuery, ExtractQueryForGet, ExtractResponse } from '@tuyau/core/types'
import type { InferInput, SimpleError } from '@vinejs/vine/types'

export type ParamValue = string | number | bigint | boolean

export interface Registry {
  'home': {
    methods: ["GET","HEAD"]
    pattern: '/'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'new_account.create': {
    methods: ["GET","HEAD"]
    pattern: '/signup'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/new_account_controller').default['create']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/new_account_controller').default['create']>>>
    }
  }
  'new_account.store': {
    methods: ["POST"]
    pattern: '/signup'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/user').signupValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/user').signupValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/new_account_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/new_account_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'session.create': {
    methods: ["GET","HEAD"]
    pattern: '/login'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/session_controller').default['create']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/session_controller').default['create']>>>
    }
  }
  'session.store': {
    methods: ["POST"]
    pattern: '/login'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/session_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/session_controller').default['store']>>>
    }
  }
  'session.destroy': {
    methods: ["POST"]
    pattern: '/logout'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/session_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/session_controller').default['destroy']>>>
    }
  }
  'dashboard': {
    methods: ["GET","HEAD"]
    pattern: '/dashboard'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'budget': {
    methods: ["GET","HEAD"]
    pattern: '/categories'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/categories_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/categories_controller').default['index']>>>
    }
  }
  'categories.store': {
    methods: ["POST"]
    pattern: '/categories'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/categorie').createCategorieValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/categorie').createCategorieValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/categories_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/categories_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'categories.update': {
    methods: ["PATCH"]
    pattern: '/categories/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/categorie').updateCategorieValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/categorie').updateCategorieValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/categories_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/categories_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'categories.destroy': {
    methods: ["DELETE"]
    pattern: '/categories/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/categories_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/categories_controller').default['destroy']>>>
    }
  }
  'depenses': {
    methods: ["GET","HEAD"]
    pattern: '/depenses'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: ExtractQueryForGet<InferInput<(typeof import('#validators/depense').indexDepenseValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/depenses_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/depenses_controller').default['index']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'depenses.store': {
    methods: ["POST"]
    pattern: '/depenses'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/depense').createDepenseValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/depense').createDepenseValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/depenses_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/depenses_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'depenses.update': {
    methods: ["PATCH"]
    pattern: '/depenses/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/depense').updateDepenseValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/depense').updateDepenseValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/depenses_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/depenses_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'depenses.destroy': {
    methods: ["DELETE"]
    pattern: '/depenses/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/depenses_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/depenses_controller').default['destroy']>>>
    }
  }
  'depenses.import.upload': {
    methods: ["POST"]
    pattern: '/depenses/import'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/depense').importUploadValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/depense').importUploadValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/depenses_import_controller').default['upload']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/depenses_import_controller').default['upload']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'depenses.import': {
    methods: ["GET","HEAD"]
    pattern: '/depenses/import'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/depenses_import_controller').default['review']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/depenses_import_controller').default['review']>>>
    }
  }
  'depenses.import.validate': {
    methods: ["POST"]
    pattern: '/depenses/import/validate'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/depense').importBatchValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/depense').importBatchValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/depenses_controller').default['storeBatch']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/depenses_controller').default['storeBatch']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'loans': {
    methods: ["GET","HEAD"]
    pattern: '/credits'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/loans_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/loans_controller').default['index']>>>
    }
  }
  'loans.show': {
    methods: ["GET","HEAD"]
    pattern: '/credits/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/loans_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/loans_controller').default['show']>>>
    }
  }
  'loans.store': {
    methods: ["POST"]
    pattern: '/credits'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/loan').storeLoanValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/loan').storeLoanValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/loans_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/loans_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'loans.update': {
    methods: ["PATCH"]
    pattern: '/credits/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/loan').updateLoanValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/loan').updateLoanValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/loans_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/loans_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'loans.destroy': {
    methods: ["DELETE"]
    pattern: '/credits/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/loans_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/loans_controller').default['destroy']>>>
    }
  }
  'investissements': {
    methods: ["GET","HEAD"]
    pattern: '/investissements'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'cryptos': {
    methods: ["GET","HEAD"]
    pattern: '/cryptos'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
}
