import { client } from '~/client'
import ReactDOMServer from 'react-dom/server'
import { TuyauProvider } from '@adonisjs/inertia/react'
import { createInertiaApp } from '@inertiajs/react'
import { resolvePageComponent } from '@adonisjs/inertia/helpers'

import DefaultLayout from '~/layouts/default'
import RootLayout from '~/layouts/root'

export default function render(page: any) {
  return createInertiaApp({
    page,
    render: ReactDOMServer.renderToString,
    resolve: (name) => {
      return resolvePageComponent(
        `./pages/${name}.tsx`,
        import.meta.glob('./pages/**/*.tsx', { eager: true }),
        DefaultLayout
      )
    },
    setup: ({ App, props }) => {
      return (
        <TuyauProvider client={client}>
          <RootLayout>
            <App {...props} />
          </RootLayout>
        </TuyauProvider>
      )
    },
  })
}
