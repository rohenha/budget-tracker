import { parse } from 'csv-parse/sync'

export type ParsedTransaction = {
  rawDate: string
  date: string | null
  libelle: string
  montant: number
  type: 'entree' | 'sortie'
  description: string | null
  dateError?: string
}

function stripBom(str: string): string {
  return str.charCodeAt(0) === 0xfeff ? str.slice(1) : str
}

function parseAmount(value: string): number {
  const trimmed = value.trim()
  if (!trimmed) return 0
  return Number.parseFloat(trimmed.replace(',', '.'))
}

function parseDate(dateStr: string): { date: string | null; error?: string } {
  const trimmed = dateStr.trim()
  if (!trimmed) return { date: null, error: 'Date vide' }
  const parts = trimmed.split('/')
  if (parts.length !== 3) return { date: null, error: `Format de date invalide: ${trimmed}` }
  const [day, month, year] = parts.map(Number)
  if (Number.isNaN(day) || Number.isNaN(month) || Number.isNaN(year))
    return { date: null, error: `Date invalide: ${trimmed}` }
  const date = new Date(Date.UTC(year, month - 1, day))
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return { date: null, error: `Date invalide: ${trimmed}` }
  }
  return { date: date.toISOString().split('T')[0], error: undefined }
}

function removeDelimiterOnlyLines(raw: string): string {
  return raw
    .replace(/\r\n/g, '\n')
    .split('\n')
    .filter((line) => !/^;*$/.test(line))
    .join('\n')
}

export function parseCreditAgricoleCsv(raw: string): ParsedTransaction[] {
  const cleaned = removeDelimiterOnlyLines(stripBom(raw))

  const records = parse(cleaned, {
    delimiter: ';',
    columns: true,
    skip_empty_lines: true,
    relax_quotes: true,
    relax_column_count: true,
  }) as Record<string, string>[]

  const transactions: ParsedTransaction[] = []

  for (const record of records) {
    const dateOp = record['Date'] ?? ''
    const libelle = record['Libellé'] ?? record['Libelle'] ?? ''
    const debit = record['Débit euros'] ?? record['Débit'] ?? record['Debit'] ?? ''
    const credit = record['Crédit euros'] ?? record['Crédit'] ?? record['Credit'] ?? ''

    const { date, error: dateError } = parseDate(dateOp)

    const montantDebit = parseAmount(debit)
    const montantCredit = parseAmount(credit)
    const montant = montantDebit > 0 ? montantDebit : montantCredit
    const type: 'entree' | 'sortie' = montantDebit > 0 ? 'sortie' : 'entree'

    if (montant === 0 && !debit && !credit) {
      continue
    }

    transactions.push({
      rawDate: dateOp,
      date,
      libelle: libelle.trim(),
      montant,
      type,
      description: null,
      dateError,
    })
  }

  return transactions
}
