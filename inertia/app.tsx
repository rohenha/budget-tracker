import './css/app.css'
import { client } from './client'
import { createRoot } from 'react-dom/client'
import { createInertiaApp } from '@inertiajs/react'
import { TuyauProvider } from '@adonisjs/inertia/react'
import { resolvePageComponent } from '@adonisjs/inertia/helpers'

import DefaultLayout from '~/layouts/default'
import RootLayout from '~/layouts/root'

const appName = import.meta.env.VITE_APP_NAME || 'AdonisJS'

createInertiaApp({
  title: (title) => (title ? `${title} - ${appName}` : appName),
  resolve: (name) => {
    return resolvePageComponent(
      `./pages/${name}.tsx`,
      import.meta.glob('./pages/**/*.tsx'),
      DefaultLayout
    )
  },
  setup({ el, App, props }) {
    createRoot(el).render(
      <TuyauProvider client={client}>
        <RootLayout>
          <App {...props} />
        </RootLayout>
      </TuyauProvider>
    )
  },
  progress: {
    color: '#4B5563',
  },
})
