import { Toaster } from 'sonner'

export default function RootLayout({ children }: { children: React.ReactNode }) {
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
