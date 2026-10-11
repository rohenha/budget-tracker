import { useState } from 'react'
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
import FormDialog from '~/components/shared/form_dialog'
import SupportSearch from '~/components/investments/support_search'
import type { SearchResult } from '~/components/investments/constants'

export default function AddInvestmentsDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
}) {
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null)

  const handleSearchSelect = (result: SearchResult) => {
    setSearchResult(result)
  }

  const resetForm = () => {
    setSearchResult(null)
  }

  return (
    <FormDialog
      open={open}
      onOpenChange={(v) => {
        if (!v) resetForm()
        onOpenChange(v)
      }}
      route="investissements.store"
      title="Ajouter un support"
      description="Enregistre un nouveau support d'investissement"
      submitLabel="Ajouter"
    >
      {({ errors }) => (
        <>
          <SupportSearch onSelect={handleSearchSelect} />
          <Field>
            <FieldLabel htmlFor="symbol">Symbole</FieldLabel>
            <FieldContent>
              <Input
                name="symbol"
                id="symbol"
                placeholder="AAPL"
                autoFocus={!searchResult}
                value={searchResult?.symbol ?? ''}
                // disabled={true}
                aria-invalid={!!errors.symbol}
                aria-describedby={errors.symbol ? 'symbol-error' : undefined}
                aria-required="true"
              />
              <FieldError id="symbol-error" errors={[{ message: errors.symbol }]} />
            </FieldContent>
          </Field>
          <Field>
            <FieldLabel htmlFor="name">Titre</FieldLabel>
            <FieldContent>
              <Input
                name="name"
                id="name"
                placeholder="Apple Inc."
                value={searchResult?.longname ?? ''}
                // disabled={true}
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? 'name-error' : undefined}
                aria-required="true"
              />
              <FieldError id="name-error" errors={[{ message: errors.name }]} />
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
                value={searchResult ? `https://finance.yahoo.com/quote/${searchResult.symbol}` : ''}
                // disabled={true}
                aria-invalid={!!errors.externalLink}
                aria-describedby={errors.externalLink ? 'externalLink-error' : undefined}
              />
              <FieldError id="externalLink-error" errors={[{ message: errors.externalLink }]} />
            </FieldContent>
          </Field>
          <Field>
            <FieldLabel htmlFor="type">Type</FieldLabel>
            <FieldContent>
              <Select
                name="type"
                aria-invalid={!!errors.type}
                aria-required="true"
                // autoFocus={!!searchResult}
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
              <FieldError id="type-error" errors={[{ message: errors.type }]} />
            </FieldContent>
          </Field>
          <Field>
            <FieldLabel htmlFor="storageLocation">Lieu de stockage</FieldLabel>
            <FieldContent>
              <Input
                name="storageLocation"
                id="storageLocation"
                placeholder="Trade Republic, Crédit Agricole..."
                aria-invalid={!!errors.storageLocation}
                aria-describedby={errors.storageLocation ? 'storageLocation-error' : undefined}
                aria-required="true"
              />
              <FieldError
                id="storageLocation-error"
                errors={[{ message: errors.storageLocation }]}
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
                aria-invalid={!!errors.annualFees}
                aria-describedby={errors.annualFees ? 'annualFees-error' : undefined}
              />
              <FieldError id="annualFees-error" errors={[{ message: errors.annualFees }]} />
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
                aria-invalid={!!errors.description}
                aria-describedby={errors.description ? 'description-error' : undefined}
              />
              <FieldError id="description-error" errors={[{ message: errors.description }]} />
            </FieldContent>
          </Field>
        </>
      )}
    </FormDialog>
  )
}
