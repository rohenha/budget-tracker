import { usePage } from '@inertiajs/react'
import type { SharedProps } from '@adonisjs/inertia/types'
import { SidebarLayout } from '~/components/sidebar'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const { props } = usePage<SharedProps>()
  return <SidebarLayout user={props.user}>{children}</SidebarLayout>
}
