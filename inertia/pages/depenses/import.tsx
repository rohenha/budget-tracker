import { useState } from 'react'
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
import ImportReviewTable from '~/components/depenses/import_review_table'
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
}

export default function ImportReview({
  transactions,
  categories,
  fileName,
  errorCount,
}: InertiaProps<{
  transactions: ParsedTransaction[]
  categories: Categorie[]
  fileName: string
  errorCount: number
}>) {
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const validTransactions = transactions.filter((t) => !t.dateError)
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
        { transactions: validTransactions },
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

      <ImportReviewTable transactions={transactions} categories={categories} />

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer l&apos;import avec erreurs</DialogTitle>
            <DialogDescription>
              {errorCount} ligne(s) contiennent des erreurs. Seules les {validTransactions.length}{' '}
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
          disabled={submitting || validTransactions.length === 0}
        >
          {submitting && <Loader2 className="size-4 mr-2 animate-spin" />}
          <Check className="size-4 mr-2" />
          Valider ({validTransactions.length})
        </Button>
      </div>
    </div>
  )
}
