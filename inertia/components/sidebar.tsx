import { type ReactElement, useState } from 'react'
import { Link } from '@adonisjs/inertia/react'
import { usePage } from '@inertiajs/react'
import { type Data } from '@generated/data'
import { X, LayoutDashboard, PiggyBank, Receipt, Landmark, TrendingUp, Bitcoin } from 'lucide-react'

import ThemeToggle from '~/components/theme_toggle'

import { cn } from '~/lib/utils'
import { Button } from '~/components/ui/button'

const navItems = [
  { route: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { route: 'budget', label: 'Budget', icon: PiggyBank },
  { route: 'depenses', label: 'Dépenses', icon: Receipt },
  { route: 'credits', label: 'Crédits', icon: Landmark },
  { route: 'investissements', label: 'Investissements', icon: TrendingUp },
  { route: 'cryptos', label: 'Cryptos', icon: Bitcoin },
]

export default function Sidebar() {
  const [open, setOpen] = useState(false)
  const { url } = usePage()

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
        aria-expanded={open}
        aria-controls="sidebar-nav"
        className="fixed top-2 left-2 z-50 lg:hidden"
        onClick={() => setOpen(!open)}
      >
        {open ? (
          <X />
        ) : (
          <div className="flex flex-col gap-1 p-1">
            <div className="h-0.5 w-4 rounded-full bg-current" />
            <div className="h-0.5 w-4 rounded-full bg-current" />
            <div className="h-0.5 w-4 rounded-full bg-current" />
          </div>
        )}
      </Button>

      <aside
        id="sidebar-nav"
        aria-label="Navigation principale"
        className={cn(
          'fixed top-0 left-0 z-40 flex h-dvh w-64 flex-col border-r bg-sidebar transition-transform motion-reduce:transition-none lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
        aria-hidden={!open}
      >
        <div className="flex h-12 items-center justify-between border-b px-4">
          <Link
            route="dashboard"
            className="text-sm font-semibold text-sidebar-foreground"
            onClick={() => setOpen(false)}
          >
            Budget Tracker
          </Link>
          <ThemeToggle className="text-sidebar-foreground" />
        </div>

        <nav className="flex flex-col gap-1 p-2">
          {navItems.map((item) => {
            const isActive = url === `/${item.route}` || url.startsWith(`/${item.route}/`)
            const Icon = item.icon
            return (
              <Link
                key={item.route}
                route={
                  item.route as
                    'dashboard' | 'budget' | 'depenses' | 'credits' | 'investissements' | 'cryptos'
                }
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'flex items-center gap-2 rounded-md px-3 py-1.5 text-xs/relaxed font-medium transition-colors motion-reduce:transition-none',
                  isActive
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
                )}
                onClick={() => setOpen(false)}
              >
                <Icon className="size-4 shrink-0" aria-hidden="true" />
                {item.label}
              </Link>
            )
          })}
        </nav>
      </aside>

      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/15 lg:hidden"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  )
}

export function SidebarLayout({ children }: { children: ReactElement<Data.SharedProps> }) {
  return (
    <div className="flex min-h-dvh">
      <Sidebar />
      <main id="main-content" className="flex-1 pt-0 lg:ml-64">
        <div className="p-4">{children}</div>
      </main>
    </div>
  )
}
