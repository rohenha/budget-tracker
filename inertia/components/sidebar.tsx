import { Link, Form } from '@adonisjs/inertia/react'
import { usePage } from '@inertiajs/react'
import type { SharedProps } from '@adonisjs/inertia/types'
import {
  LayoutDashboard,
  PiggyBank,
  Receipt,
  Landmark,
  TrendingUp,
  Bitcoin,
  Wallet,
  LogOut,
  User,
} from 'lucide-react'

import ThemeToggle from '~/components/theme_toggle'
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
  SidebarFooter,
} from '~/components/ui/sidebar'

const navItems = [
  { route: 'dashboard' as const, label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  { route: 'budget' as const, label: 'Budget', icon: PiggyBank, href: '/categories' },
  { route: 'depenses' as const, label: 'Dépenses', icon: Receipt, href: '/depenses' },
  { route: 'loans' as const, label: 'Crédits', icon: Landmark, href: '/credits' },
  { route: 'investissements' as const, label: 'Investissements', icon: TrendingUp, href: '/investissements' },
  { route: 'cryptos' as const, label: 'Cryptos', icon: Bitcoin, href: '/cryptos' },
]

function AppSidebar({ user }: { user: SharedProps['user'] }) {
  const { url } = usePage()

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b">
        <SidebarMenuButton tooltip="Budget Tracker" render={<Link route="dashboard" />}>
          <Wallet />
          <span>Budget Tracker</span>
        </SidebarMenuButton>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive = url === item.href || url.startsWith(`${item.href}/`)
                const Icon = item.icon
                return (
                  <SidebarMenuItem key={item.route}>
                    <SidebarMenuButton
                      isActive={isActive}
                      tooltip={item.label}
                      render={<Link route={item.route} />}
                    >
                      <Icon />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        {user ? (
          <SidebarMenuButton tooltip={user.fullName ?? ''}>
            <User />
            <span>{user.fullName}</span>
          </SidebarMenuButton>
        ) : null}
        <Form route="session.destroy">
          <SidebarMenuButton tooltip="Déconnexion" type="submit">
            <LogOut />
            <span>Déconnexion</span>
          </SidebarMenuButton>
        </Form>
      </SidebarFooter>
    </Sidebar>
  )
}

export default AppSidebar

export function SidebarLayout({
  children,
  user,
}: {
  children: React.ReactNode
  user: SharedProps['user']
}) {
  return (
    <SidebarProvider>
      <AppSidebar user={user} />
      <SidebarInset>
        <header className="flex h-12 items-center justify-between gap-2 border-b px-4">
          <SidebarTrigger />
          <ThemeToggle className="text-sidebar-foreground" />
        </header>
        <div id="main-content" className="flex-1 p-4">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
