import { Moon, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'

import { Button } from '~/components/ui/button'
import { cn } from '~/lib/utils'
import { getResolvedTheme, getStoredTheme, initTheme, setTheme, type Theme } from '~/lib/theme'

export default function ThemeToggle({ className }: { className?: string }) {
  const [theme, setThemeState] = useState<Theme>(getStoredTheme)

  useEffect(() => {
    initTheme()
  }, [])

  function cycle() {
    const next: Record<Theme, Theme> = { light: 'dark', dark: 'system', system: 'light' }
    const t = next[theme]
    setTheme(t)
    setThemeState(t)
  }

  const resolved = theme === 'system' ? getResolvedTheme() : theme

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Changer le thème"
      onClick={cycle}
      className={cn('size-8', className)}
    >
      {resolved === 'dark' ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </Button>
  )
}
