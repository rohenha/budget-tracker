import { useState } from 'react'
import { useForm } from '@inertiajs/react'
import { useTuyau } from '@adonisjs/inertia/react'
import { Input } from '~/components/ui/input'
import { Field, FieldContent, FieldError, FieldLabel } from '~/components/ui/field'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import { Textarea } from '~/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog'
import { Button } from '~/components/ui/button'
import SupportSearch from '~/components/investments/support_search'
import type { SearchResult } from '~/components/investments/constants'
import { router } from '@inertiajs/react'

interface FormData {
  symbol: string
  name: string
  externalLink: string
  type: 'PEA' | 'AV' | 'CTO' | ''
  storageLocation: string
  annualFees: string
  description: string
}

export default function AddInvestmentsDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
}) {
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null)
  const tuyau = useTuyau()

  const {
    data,
    setData,
    errors,
    processing,
    submit,
    reset: resetFormState,
  } = useForm<FormData>({
    symbol: '',
    name: '',
    externalLink: '',
    type: '',
    storageLocation: '',
    annualFees: '',
    description: '',
  })

  const handleSearchSelect = (result: SearchResult) => {
    setSearchResult(result)
    setData('symbol', result.symbol)
    setData('name', result.longname)
    setData('externalLink', `https://finance.yahoo.com/quote/${result.symbol}`)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const routeInfo = tuyau.getRoute('investissements.store', { params: {} })
    const method = routeInfo.methods[0].toLowerCase() as 'get' | 'post' | 'put' | 'patch' | 'delete'
    submit(method, routeInfo.url, {
      onSuccess: () => {
        setSearchResult(null)
        resetFormState()
        onOpenChange(false)
        router.visit('/investissements')
      },
      onError: () => {
        // Errors are automatically handled by useForm
      },
    })
  }

  const handleOpenChange = (value: boolean) => {
    if (!value) {
      setSearchResult(null)
      resetFormState()
    }
    onOpenChange(value)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Ajouter un support</DialogTitle>
            <DialogDescription>
              Enregistre un nouveau support d&apos;investissement
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <SupportSearch onSelect={handleSearchSelect} />
            <Field>
              <FieldLabel htmlFor="symbol">Symbole</FieldLabel>
              <FieldContent>
                <Input
                  name="symbol"
                  id="symbol"
                  placeholder="AAPL"
                  autoFocus={!searchResult}
                  value={data.symbol}
                  onChange={(e) => setData('symbol', e.target.value)}
                  aria-invalid={!!errors.symbol}
                  aria-describedby={errors.symbol ? 'symbol-error' : undefined}
                  aria-required="true"
                  disabled={processing}
                />
                <FieldError
                  id="symbol-error"
                  errors={errors.symbol ? [{ message: errors.symbol }] : []}
                />
              </FieldContent>
            </Field>
            <Field>
              <FieldLabel htmlFor="name">Titre</FieldLabel>
              <FieldContent>
                <Input
                  name="name"
                  id="name"
                  placeholder="Apple Inc."
                  value={data.name}
                  onChange={(e) => setData('name', e.target.value)}
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? 'name-error' : undefined}
                  aria-required="true"
                  disabled={processing}
                />
                <FieldError
                  id="name-error"
                  errors={errors.name ? [{ message: errors.name }] : []}
                />
              </FieldContent>
            </Field>
            <Field>
              <FieldLabel htmlFor="externalLink">Lien externe</FieldLabel>
              <FieldContent>
                <Input
                  type="url"
                  name="externalLink"
                  id="externalLink"
                  placeholder="https://finance.yahoo.com/quote/AAPL"
                  value={data.externalLink}
                  onChange={(e) => setData('externalLink', e.target.value)}
                  aria-invalid={!!errors.externalLink}
                  aria-describedby={errors.externalLink ? 'externalLink-error' : undefined}
                  disabled={processing}
                />
                <FieldError
                  id="externalLink-error"
                  errors={errors.externalLink ? [{ message: errors.externalLink }] : []}
                />
              </FieldContent>
            </Field>
            <Field>
              <FieldLabel htmlFor="type">Type</FieldLabel>
              <FieldContent>
                <Select
                  name="type"
                  value={data.type}
                  onValueChange={(value) => setData('type', value as FormData['type'])}
                  aria-invalid={!!errors.type}
                  aria-required="true"
                  disabled={processing}
                >
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PEA">PEA</SelectItem>
                    <SelectItem value="AV">Assurance Vie</SelectItem>
                    <SelectItem value="CTO">Compte Titres</SelectItem>
                  </SelectContent>
                </Select>
                <FieldError
                  id="type-error"
                  errors={errors.type ? [{ message: errors.type }] : []}
                />
              </FieldContent>
            </Field>
            <Field>
              <FieldLabel htmlFor="storageLocation">Lieu de stockage</FieldLabel>
              <FieldContent>
                <Input
                  name="storageLocation"
                  id="storageLocation"
                  placeholder="Trade Republic, Crédit Agricole..."
                  value={data.storageLocation}
                  onChange={(e) => setData('storageLocation', e.target.value)}
                  aria-invalid={!!errors.storageLocation}
                  aria-describedby={errors.storageLocation ? 'storageLocation-error' : undefined}
                  aria-required="true"
                  disabled={processing}
                />
                <FieldError
                  id="storageLocation-error"
                  errors={errors.storageLocation ? [{ message: errors.storageLocation }] : []}
                />
              </FieldContent>
            </Field>
            <Field>
              <FieldLabel htmlFor="annualFees">Frais annuels (%)</FieldLabel>
              <FieldContent>
                <Input
                  type="number"
                  name="annualFees"
                  id="annualFees"
                  step="0.01"
                  min="0"
                  max="100"
                  placeholder="0.5"
                  value={data.annualFees}
                  onChange={(e) => setData('annualFees', e.target.value)}
                  aria-invalid={!!errors.annualFees}
                  aria-describedby={errors.annualFees ? 'annualFees-error' : undefined}
                  disabled={processing}
                />
                <FieldError
                  id="annualFees-error"
                  errors={errors.annualFees ? [{ message: errors.annualFees }] : []}
                />
              </FieldContent>
            </Field>
            <Field>
              <FieldLabel htmlFor="description">Description</FieldLabel>
              <FieldContent>
                <Textarea
                  name="description"
                  id="description"
                  placeholder="Description optionnelle"
                  rows={3}
                  value={data.description}
                  onChange={(e) => setData('description', e.target.value)}
                  aria-invalid={!!errors.description}
                  aria-describedby={errors.description ? 'description-error' : undefined}
                  disabled={processing}
                />
                <FieldError
                  id="description-error"
                  errors={errors.description ? [{ message: errors.description }] : []}
                />
              </FieldContent>
            </Field>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onOpenChange(false)}
                disabled={processing}
              >
                Annuler
              </Button>
              <Button type="submit" size="sm" disabled={processing}>
                {processing ? 'Ajout...' : 'Ajouter'}
              </Button>
            </DialogFooter>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
