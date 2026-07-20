import { client } from '~/client'
import { type ReactElement } from 'react'
import { type Data } from '@generated/data'
import ReactDOMServer from 'react-dom/server'
import { TuyauProvider } from '@adonisjs/inertia/react'
import { createInertiaApp } from '@inertiajs/react'
import { resolvePageComponent } from '@adonisjs/inertia/helpers'

import AuthLayout from '~/layouts/auth'
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
        (child: ReactElement<Data.SharedProps>) => {
          if (child.props.user) {
            return <AuthLayout children={child} />
          }
          return <DefaultLayout children={child} />
        }
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
