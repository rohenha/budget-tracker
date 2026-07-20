import { type Data } from '@generated/data'
import { Button } from '~/components/ui/button'
import { usePage } from '@inertiajs/react'
import { type ReactElement, useEffect } from 'react'
import { Form, Link } from '@adonisjs/inertia/react'
import ThemeToggle from '~/components/theme_toggle'

export default function PublicLayout({ children }: { children: ReactElement<Data.SharedProps> }) {
  const { url } = usePage()

  useEffect(() => {
    import('sonner').then(({ toast }) => toast.dismiss())
  }, [url])

  return (
    <>
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
    </>
  )
}
