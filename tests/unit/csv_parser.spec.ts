import { test } from '@japa/runner'
import { parseCreditAgricoleCsv } from '#services/csv_parser'

test.group('CsvParser — parseCreditAgricoleCsv', () => {
  // ─── Nominal cases ────────────────────────────────────────────────────────────

  test('parses a simple expense transaction', ({ assert }) => {
    const csv = `Date;Libellé;Débit euros;Crédit euros
01/07/2026;GROCERIES LECLERC;45,50;`
    const result = parseCreditAgricoleCsv(csv)
    assert.lengthOf(result, 1)
    assert.equal(result[0].libelle, 'GROCERIES LECLERC')
    assert.equal(result[0].montant, 45.5)
    assert.equal(result[0].type, 'sortie')
    assert.equal(result[0].date, '2026-07-01')
    assert.isUndefined(result[0].dateError)
  })

  test('parses a simple income transaction', ({ assert }) => {
    const csv = `Date;Libellé;Débit euros;Crédit euros
15/06/2026;SALARY TRANSFER;;2500,00`
    const result = parseCreditAgricoleCsv(csv)
    assert.lengthOf(result, 1)
    assert.equal(result[0].type, 'entree')
    assert.equal(result[0].montant, 2500)
    assert.equal(result[0].libelle, 'SALARY TRANSFER')
  })

  test('parses multiple transactions', ({ assert }) => {
    const csv = `Date;Libellé;Débit euros;Crédit euros
01/07/2026;RENT;800,00;
02/07/2026;SALARY;;3000,00
03/07/2026;GROCERIES;55,30;`
    const result = parseCreditAgricoleCsv(csv)
    assert.lengthOf(result, 3)
    assert.equal(result[0].type, 'sortie')
    assert.equal(result[1].type, 'entree')
    assert.equal(result[2].type, 'sortie')
  })

  test('handles UTF-8 BOM at start of file', ({ assert }) => {
    const bom = '\uFEFF'
    const csv = `${bom}Date;Libellé;Débit euros;Crédit euros
01/07/2026;TEST BOM;10,00;`
    const result = parseCreditAgricoleCsv(csv)
    assert.lengthOf(result, 1)
    assert.equal(result[0].libelle, 'TEST BOM')
  })

  test('handles column name variants (Debit/Credit without accent)', ({ assert }) => {
    const csv = `Date;Libelle;Debit;Credit
05/07/2026;EXPENSE NO ACCENT;20,00;`
    const result = parseCreditAgricoleCsv(csv)
    assert.lengthOf(result, 1)
    assert.equal(result[0].montant, 20)
  })

  test('ignores lines containing only semicolons', ({ assert }) => {
    const csv = `Date;Libellé;Débit euros;Crédit euros
01/07/2026;VALID;10,00;
;;;
02/07/2026;VALID2;5,00;`
    const result = parseCreditAgricoleCsv(csv)
    assert.lengthOf(result, 2)
  })

  test('ignores lines with empty amount and debit/credit', ({ assert }) => {
    const csv = `Date;Libellé;Débit euros;Crédit euros
01/07/2026;NO AMOUNT;;`
    const result = parseCreditAgricoleCsv(csv)
    assert.lengthOf(result, 0)
  })

  // ─── Date handling ──────────────────────────────────────────────────────────

  test('returns dateError for invalid date format', ({ assert }) => {
    const csv = `Date;Libellé;Débit euros;Crédit euros
2026-07-01;ISO FORMAT;10,00;`
    const result = parseCreditAgricoleCsv(csv)
    assert.lengthOf(result, 1)
    assert.isNull(result[0].date)
    assert.isString(result[0].dateError)
    assert.include(result[0].dateError!, 'Invalid date format')
  })

  test('returns dateError for empty date', ({ assert }) => {
    const csv = `Date;Libellé;Débit euros;Crédit euros
;EMPTY DATE;10,00;`
    const result = parseCreditAgricoleCsv(csv)
    assert.lengthOf(result, 1)
    assert.isNull(result[0].date)
    assert.equal(result[0].dateError, 'Empty date')
  })

  test('returns dateError for impossible date (31/02)', ({ assert }) => {
    const csv = `Date;Libellé;Débit euros;Crédit euros
31/02/2026;IMPOSSIBLE DATE;10,00;`
    const result = parseCreditAgricoleCsv(csv)
    assert.lengthOf(result, 1)
    assert.isNull(result[0].date)
    assert.isString(result[0].dateError)
  })

  test('accepts valid end-of-month date (28/02)', ({ assert }) => {
    const csv = `Date;Libellé;Débit euros;Crédit euros
28/02/2026;END FEBRUARY;10,00;`
    const result = parseCreditAgricoleCsv(csv)
    assert.equal(result[0].date, '2026-02-28')
    assert.isUndefined(result[0].dateError)
  })

  // ─── Amount handling ─────────────────────────────────────────────────────────

  test('parses amounts with comma as decimal separator', ({ assert }) => {
    const csv = `Date;Libellé;Débit euros;Crédit euros
01/07/2026;COMMA;1234,56;`
    const result = parseCreditAgricoleCsv(csv)
    assert.equal(result[0].montant, 1234.56)
  })

  test('parses amounts with dot as decimal separator', ({ assert }) => {
    const csv = `Date;Libellé;Débit euros;Crédit euros
01/07/2026;DOT;99.99;`
    const result = parseCreditAgricoleCsv(csv)
    assert.equal(result[0].montant, 99.99)
  })

  test('returns 0 for empty amount', ({ assert }) => {
    const csv = `Date;Libellé;Débit euros;Crédit euros
01/07/2026;ZERO;;0`
    const result = parseCreditAgricoleCsv(csv)
    // amount 0 credit + empty debit amount => not ignored because montant === 0 && !debit && !credit is not the case
    // credit = "0", so montant = 0, not ignored
    assert.lengthOf(result, 1)
    assert.equal(result[0].montant, 0)
  })

  // ─── Empty file / edge cases ─────────────────────────────────────────────────

  test('returns empty array for CSV without data rows', ({ assert }) => {
    const csv = `Date;Libellé;Débit euros;Crédit euros`
    const result = parseCreditAgricoleCsv(csv)
    assert.lengthOf(result, 0)
  })

  test('preserves rawDate as is', ({ assert }) => {
    const csv = `Date;Libellé;Débit euros;Crédit euros
01/07/2026;TEST;10,00;`
    const result = parseCreditAgricoleCsv(csv)
    assert.equal(result[0].rawDate, '01/07/2026')
  })

  test('description is always null', ({ assert }) => {
    const csv = `Date;Libellé;Débit euros;Crédit euros
01/07/2026;TEST;10,00;`
    const result = parseCreditAgricoleCsv(csv)
    assert.isNull(result[0].description)
  })

  test('libelle is trimmed of spaces', ({ assert }) => {
    const csv = `Date;Libellé;Débit euros;Crédit euros
01/07/2026;  SPACES  ;10,00;`
    const result = parseCreditAgricoleCsv(csv)
    assert.equal(result[0].libelle, 'SPACES')
  })
})
