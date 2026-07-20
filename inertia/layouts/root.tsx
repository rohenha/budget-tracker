import { Toaster, toast } from 'sonner'
import { usePage } from '@inertiajs/react'
import { useEffect } from 'react'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const { url, props } = usePage()
  const flash = props.flash as { success?: string; error?: string } | undefined
  useEffect(() => {
    if (flash?.success) toast.success(flash.success)
    if (flash?.error) toast.error(flash.error)
  }, [flash])
  useEffect(() => {
    toast.dismiss()
  }, [url])
  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-background focus:px-3 focus:py-1.5 focus:text-xs focus:font-medium focus:ring-2 focus:ring-ring"
      >
        Aller au contenu principal
      </a>
      {children}
      <Toaster position="top-center" richColors />
    </>
  )
}
