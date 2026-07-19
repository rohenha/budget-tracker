import { type Data } from '@generated/data'
import { Button } from '~/components/ui/button'
import { toast, Toaster } from 'sonner'
import { usePage } from '@inertiajs/react'
import { type ReactElement, useEffect } from 'react'
import { Form, Link } from '@adonisjs/inertia/react'

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

  return (
    <>
      <header className="flex items-center justify-between py-4 px-2 fixed top-0 left-0 w-full z-3 bg-white">
        <Link route="home">Budget tracker</Link>
        <nav className="flex items-center gap-1">
          {children.props.user ? (
            <>
              <span>{children.props.user.initials}</span>
              <Form route="session.destroy">
                <Button type="submit"> Logout </Button>
              </Form>
            </>
          ) : (
            <>
              <Button as-child>
                <Link route="new_account.create">Signup</Link>
              </Button>
              <Button as-child>
                <Link route="session.create">Login</Link>
              </Button>
            </>
          )}
        </nav>
      </header>
      <main className="pt-24">{children}</main>
      <Toaster position="top-center" richColors />
    </>
  )
}
