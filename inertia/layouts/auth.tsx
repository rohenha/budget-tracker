import { usePage } from '@inertiajs/react'
import type { SharedProps } from '@adonisjs/inertia/types'
import { SidebarLayout } from '~/components/sidebar'
import RootLayout from '~/layouts/root'
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const { props } = usePage<SharedProps>()
  return (
    <RootLayout>
      <SidebarLayout user={props.user}>{children}</SidebarLayout>
    </RootLayout>
  )
}
