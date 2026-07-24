/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import { middleware } from '#start/kernel'
import { controllers } from '#generated/controllers'
import router from '@adonisjs/core/services/router'

router.on('/').renderInertia('home', {}).as('home')

router
  .group(() => {
    router.get('signup', [controllers.NewAccount, 'create'])
    router.post('signup', [controllers.NewAccount, 'store'])

    router.get('login', [controllers.Session, 'create'])
    router.post('login', [controllers.Session, 'store'])
  })
  .use(middleware.guest())

router
  .group(() => {
    router.post('logout', [controllers.Session, 'destroy'])

    router.on('/dashboard').renderInertia('dashboard/index', {}).as('dashboard')

    router
      .group(() => {
        router.get('/', [controllers.Categories, 'index']).as('budget')
        router.post('/', [controllers.Categories, 'store']).as('categories.store')
        router.patch('/:id', [controllers.Categories, 'update']).as('categories.update')
        router.delete('/:id', [controllers.Categories, 'destroy']).as('categories.destroy')
      })
      .prefix('/categories')

    router
      .group(() => {
        router.get('/', [controllers.Depenses, 'index']).as('depenses')
        router.post('/', [controllers.Depenses, 'store']).as('depenses.store')
        router.patch('/:id', [controllers.Depenses, 'update']).as('depenses.update')
        router.delete('/:id', [controllers.Depenses, 'destroy']).as('depenses.destroy')
        router.post('/import', [controllers.DepensesImport, 'upload']).as('depenses.import.upload')
        router.get('/import', [controllers.DepensesImport, 'review']).as('depenses.import')
        router
          .post('/import/validate', [controllers.Depenses, 'storeBatch'])
          .as('depenses.import.validate')
      })
      .prefix('/depenses')

    router.on('/credits').renderInertia('credits/index', {}).as('credits')
    router.on('/investissements').renderInertia('investissements/index', {}).as('investissements')
    router.on('/cryptos').renderInertia('cryptos/index', {}).as('cryptos')
  })
  .use(middleware.auth())
