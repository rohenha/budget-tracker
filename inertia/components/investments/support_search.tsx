import { useState, useEffect, useRef, useCallback } from 'react'
import { Search, Loader2, X } from 'lucide-react'
import { cn } from '~/lib/utils'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import type { SearchResult } from '~/components/investments/constants'

type Props = {
  onSelect: (result: SearchResult) => void
  disabled?: boolean
}

export default function SupportSearch({ onSelect, disabled = false }: Props) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const debounceRef = useRef<NodeJS.Timeout | null>(null)

  const fetchResults = useCallback(async (searchQuery: string) => {
    if (searchQuery.length < 2) {
      setResults([])
      setIsOpen(false)
      return
    }
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch(`/investissements/search?q=${encodeURIComponent(searchQuery)}`, {
        headers: {
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
      })
      if (!response.ok) {
        if (response.status === 422) {
          setError('Requête trop courte')
        } else {
          throw new Error('Erreur serveur')
        }
        setResults([])
        setIsOpen(false)
        return
      }
      const data = await response.json()
      setResults(data.results || [])
      setIsOpen(data.results && data.results.length > 0)
    } catch {
      setError('Recherche indisponible')
      setResults([])
      setIsOpen(false)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const handleChange = (value: string) => {
    setQuery(value)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => fetchResults(value), 600)
  }

  const handleSelect = (result: SearchResult) => {
    setQuery('')
    setResults([])
    setIsOpen(false)
    setSelectedIndex(-1)
    onSelect(result)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || results.length === 0) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((i) => (i + 1) % results.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((i) => (i - 1 + results.length) % results.length)
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault()
      handleSelect(results[selectedIndex])
    } else if (e.key === 'Escape') {
      setIsOpen(false)
      setSelectedIndex(-1)
      inputRef.current?.blur()
    }
  }

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [])

  if (disabled) return null

  return (
    <div
      className="w-full"
      role="combobox"
      aria-expanded={isOpen}
      aria-haspopup="listbox"
      aria-label="Rechercher un support"
    >
      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground"
          aria-hidden="true"
        />
        <Input
          ref={inputRef}
          type="search"
          placeholder="Rechercher un support (nom ou symbole)..."
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => query.length >= 2 && setIsOpen(results.length > 0)}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
          className="pl-10 pr-10 min-h-11"
          disabled={disabled}
          aria-autocomplete="list"
          aria-controls="search-results"
          aria-activedescendant={selectedIndex >= 0 ? `search-result-${selectedIndex}` : undefined}
        />
        {isLoading && (
          <Loader2
            className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground animate-spin"
            aria-hidden="true"
          />
        )}
        {query && !isLoading && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1"
            onClick={() => {
              setQuery('')
              setResults([])
              setIsOpen(false)
              inputRef.current?.focus()
            }}
            aria-label="Effacer la recherche"
          >
            <X className="size-4" />
          </Button>
        )}
      </div>

      {isOpen && (
        <div
          id="search-results"
          role="listbox"
          className="absolute z-50 w-full mt-1 max-h-60 overflow-auto rounded-md border bg-popover text-popover-foreground shadow-md"
        >
          {isLoading ? (
            <div
              className="p-4 text-center text-sm text-muted-foreground"
              role="status"
              aria-live="polite"
            >
              <Loader2 className="mx-auto mb-2 size-4 animate-spin" />
              Recherche en cours...
            </div>
          ) : error ? (
            <div className="p-4 text-center text-sm text-destructive" role="alert">
              {error}
            </div>
          ) : results.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              Aucun support trouvé — saisie manuelle possible
            </div>
          ) : (
            results.map((result, index) => (
              <div
                key={result.symbol}
                id={`search-result-${index}`}
                role="option"
                aria-selected={index === selectedIndex}
                onClick={() => handleSelect(result)}
                onMouseEnter={() => setSelectedIndex(index)}
                className={cn(
                  'px-3 py-2 text-sm cursor-pointer select-none',
                  index === selectedIndex ? 'bg-accent text-accent-foreground' : 'hover:bg-accent'
                )}
              >
                <div className="font-medium">{result.longname}</div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="font-mono">{result.symbol}</span>
                  {result.exchange && <span>·</span>}
                  {result.exchange && <span>{result.exchange}</span>}
                  <span>·</span>
                  <span className="capitalize">{result.quoteType.toLowerCase()}</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}
