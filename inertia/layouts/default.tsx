import { type Data } from '@generated/data'
import { Button } from '~/components/ui/button'
import { toast, Toaster } from 'sonner'
import { usePage } from '@inertiajs/react'
import { type ReactElement, useEffect } from 'react'
import { Form, Link } from '@adonisjs/inertia/react'
import ThemeToggle from '~/components/theme_toggle'
import { SidebarLayout } from '~/components/sidebar'

export default function Layout({ children }: { children: ReactElement<Data.SharedProps> }) {
  const { url } = usePage()

  useEffect(() => {
    toast.dismiss()
  }, [url])

  useEffect(() => {
    if (children.props.flash.error) {
      toast.error(children.props.flash.error)
    }
    if (children.props.flash.success) {
      toast.success(children.props.flash.success)
    }
  })

  const isAuthenticated = !!children.props.user

  if (isAuthenticated) {
    return (
      <>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-background focus:px-3 focus:py-1.5 focus:text-xs focus:font-medium focus:ring-2 focus:ring-ring"
        >
          Aller au contenu principal
        </a>
        <SidebarLayout children={children} />
        <Toaster position="top-center" richColors />
      </>
    )
  }

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-background focus:px-3 focus:py-1.5 focus:text-xs focus:font-medium focus:ring-2 focus:ring-ring"
      >
        Aller au contenu principal
      </a>
      <header className="flex items-center justify-between py-4 px-2 fixed top-0 left-0 w-full z-3 bg-background">
        <Link route="home" className="text-sm font-semibold">
          Budget tracker
        </Link>
        <nav className="flex items-center gap-1">
          <ThemeToggle />
          {children.props.user ? (
            <>
              <span className="text-xs text-muted-foreground">{children.props.user.initials}</span>
              <Form route="session.destroy">
                <Button type="submit">Logout</Button>
              </Form>
            </>
          ) : (
            <>
              <Button variant="outline" render={<Link route="new_account.create" />}>
                Signup
              </Button>
              <Button render={<Link route="session.create" />}>Login</Button>
            </>
          )}
        </nav>
      </header>
      <main id="main-content" className="pt-24">
        {children}
      </main>
      <Toaster position="top-center" richColors />
    </>
  )
}
