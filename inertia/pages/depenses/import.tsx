import { useState, useCallback } from 'react'
import { router } from '@inertiajs/react'
import { X, Check, Loader2 } from 'lucide-react'
import { Button } from '~/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog'
import { toast } from 'sonner'
import ImportReviewTable, { type EditableTransaction } from '~/components/depenses/import_review_table'
import type { InertiaProps } from '~/types'
import type { Categorie } from '~/components/budget/constants'

type ParsedTransaction = {
  rawDate: string
  date: string | null
  libelle: string
  montant: number
  type: 'entree' | 'sortie'
  description: string | null
  dateError?: string
  categorieId?: number
}

export default function ImportReview({
  transactions,
  categories,
  fileName,
  errorCount: _errorCount,
}: InertiaProps<{
  transactions: ParsedTransaction[]
  categories: Categorie[]
  fileName: string
  errorCount: number
}>) {
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const [rows, setRows] = useState<EditableTransaction[]>(
    transactions.map((t) => ({
      ...t,
      editingField: null,
      originalValues: {
        date: t.date,
        libelle: t.libelle,
        montant: t.montant,
        type: t.type,
        description: t.description,
        categorieId: undefined,
      },
    }))
  )

  const startEdit = useCallback((index: number, field: keyof EditableTransaction) => {
    setRows((prev) =>
      prev.map((r, i) =>
        i === index ? { ...r, editingField: field } : { ...r, editingField: null }
      )
    )
  }, [])

  const updateField = useCallback((index: number, field: keyof EditableTransaction, value: any) => {
    setRows((prev) => prev.map((r, i) => (i === index ? { ...r, [field]: value } : r)))
  }, [])

  const commitEdit = useCallback((index: number, field: keyof EditableTransaction, value?: any) => {
    setRows((prev) =>
      prev.map((r, i) =>
        i === index
          ? {
              ...r,
              ...(value !== undefined ? { [field]: value } : {}),
              editingField: null,
              originalValues: {
                ...r.originalValues,
                [field]:
                  r.originalValues[field] === undefined
                    ? value !== undefined
                      ? value
                      : r[field]
                    : r.originalValues[field],
              },
            }
          : r
      )
    )
  }, [])

  const cancelEdit = useCallback((index: number) => {
    setRows((prev) =>
      prev.map((r, i) =>
        i === index
          ? {
              ...r,
              date: r.originalValues.date,
              libelle: r.originalValues.libelle,
              montant: r.originalValues.montant,
              type: r.originalValues.type,
              description: r.originalValues.description,
              categorieId: r.originalValues.categorieId,
              editingField: null,
            }
          : { ...r, editingField: null }
      )
    )
  }, [])

  const validRows = rows.filter((r) => !r.dateError)
  const errorCount = rows.filter((r) => r.dateError).length
  const hasErrors = errorCount > 0

  const handleValidate = () => {
    if (hasErrors) {
      setConfirmOpen(true)
    } else {
      submitTransactions()
    }
  }

  const submitTransactions = async () => {
    setSubmitting(true)
    try {
      await router.post(
        '/depenses/import/validate',
        { transactions: validRows },
        {
          onSuccess: () => toast.success('Import validé'),
          onError: (errors) => toast.error(errors.message ?? 'Erreur lors de la validation'),
        }
      )
    } finally {
      setSubmitting(false)
    }
  }

  const handleCancel = () => {
    router.get('/depenses')
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1>Revue d&apos;import CSV</h1>
        <p className="text-sm text-muted-foreground">Fichier : {fileName}</p>
      </div>

      <ImportReviewTable
        rows={rows}
        categories={categories}
        onStartEdit={startEdit}
        onUpdateField={updateField}
        onCommitEdit={commitEdit}
        onCancelEdit={cancelEdit}
      />

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer l&apos;import avec erreurs</DialogTitle>
            <DialogDescription>
              {errorCount} ligne(s) contiennent des erreurs. Seules les {validRows.length}{' '}
              ligne(s) valides seront enregistrées. Continuer ?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setConfirmOpen(false)}>
              Annuler
            </Button>
            <Button
              size="sm"
              onClick={() => {
                setConfirmOpen(false)
                submitTransactions()
              }}
            >
              Confirmer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="flex justify-end gap-3">
        <Button variant="outline" size="sm" onClick={handleCancel} disabled={submitting}>
          <X className="size-4 mr-2" />
          Annuler
        </Button>
        <Button
          size="sm"
          onClick={handleValidate}
          disabled={submitting || validRows.length === 0}
        >
          {submitting && <Loader2 className="size-4 mr-2 animate-spin" />}
          <Check className="size-4 mr-2" />
          Valider ({validRows.length})
        </Button>
      </div>
    </div>
  )
}
