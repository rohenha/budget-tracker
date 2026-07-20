import { Link } from '@adonisjs/inertia/react'
import { usePage } from '@inertiajs/react'
import { LayoutDashboard, PiggyBank, Receipt, Landmark, TrendingUp, Bitcoin } from 'lucide-react'

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
} from '~/components/ui/sidebar'

const navItems = [
  { route: 'dashboard' as const, label: 'Dashboard', icon: LayoutDashboard },
  { route: 'budget' as const, label: 'Budget', icon: PiggyBank },
  { route: 'depenses' as const, label: 'Dépenses', icon: Receipt },
  { route: 'credits' as const, label: 'Crédits', icon: Landmark },
  { route: 'investissements' as const, label: 'Investissements', icon: TrendingUp },
  { route: 'cryptos' as const, label: 'Cryptos', icon: Bitcoin },
]

function AppSidebar() {
  const { url } = usePage()

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="flex-row items-center justify-between border-b px-4 py-2">
        <Link route="dashboard" className="text-sm font-semibold text-sidebar-foreground">
          Budget Tracker
        </Link>
        <ThemeToggle className="text-sidebar-foreground" />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive = url === `/${item.route}` || url.startsWith(`/${item.route}/`)
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
    </Sidebar>
  )
}

export default AppSidebar

export function SidebarLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-12 items-center gap-2 border-b px-4">
          <SidebarTrigger />
        </header>
        <main id="main-content" className="flex-1 p-4">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
