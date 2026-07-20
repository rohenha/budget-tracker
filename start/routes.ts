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
    router.on('/budget').renderInertia('budget/index', {}).as('budget')
    router.on('/depenses').renderInertia('depenses/index', {}).as('depenses')
    router.on('/credits').renderInertia('credits/index', {}).as('credits')
    router.on('/investissements').renderInertia('investissements/index', {}).as('investissements')
    router.on('/cryptos').renderInertia('cryptos/index', {}).as('cryptos')
  })
  .use(middleware.auth())
