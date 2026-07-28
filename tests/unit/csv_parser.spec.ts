import { test } from '@japa/runner'
import { parseCreditAgricoleCsv } from '#services/csv_parser'

test.group('CsvParser — parseCreditAgricoleCsv', () => {
  // ─── Cas nominaux ────────────────────────────────────────────────────────────

  test('parse une transaction sortie simple', ({ assert }) => {
    const csv = `Date;Libellé;Débit euros;Crédit euros
01/07/2026;COURSES LECLERC;45,50;`
    const result = parseCreditAgricoleCsv(csv)
    assert.lengthOf(result, 1)
    assert.equal(result[0].libelle, 'COURSES LECLERC')
    assert.equal(result[0].montant, 45.5)
    assert.equal(result[0].type, 'sortie')
    assert.equal(result[0].date, '2026-07-01')
    assert.isUndefined(result[0].dateError)
  })

  test('parse une transaction entree simple', ({ assert }) => {
    const csv = `Date;Libellé;Débit euros;Crédit euros
15/06/2026;VIREMENT SALAIRE;;2500,00`
    const result = parseCreditAgricoleCsv(csv)
    assert.lengthOf(result, 1)
    assert.equal(result[0].type, 'entree')
    assert.equal(result[0].montant, 2500)
    assert.equal(result[0].libelle, 'VIREMENT SALAIRE')
  })

  test('parse plusieurs transactions', ({ assert }) => {
    const csv = `Date;Libellé;Débit euros;Crédit euros
01/07/2026;LOYER;800,00;
02/07/2026;SALAIRE;;3000,00
03/07/2026;COURSES;55,30;`
    const result = parseCreditAgricoleCsv(csv)
    assert.lengthOf(result, 3)
    assert.equal(result[0].type, 'sortie')
    assert.equal(result[1].type, 'entree')
    assert.equal(result[2].type, 'sortie')
  })

  test('gere le BOM UTF-8 en debut de fichier', ({ assert }) => {
    const bom = '\uFEFF'
    const csv = `${bom}Date;Libellé;Débit euros;Crédit euros
01/07/2026;TEST BOM;10,00;`
    const result = parseCreditAgricoleCsv(csv)
    assert.lengthOf(result, 1)
    assert.equal(result[0].libelle, 'TEST BOM')
  })

  test('gere les variantes de noms de colonnes (Debit/Credit sans accent)', ({ assert }) => {
    const csv = `Date;Libelle;Debit;Credit
05/07/2026;DEPENSE SANS ACCENT;20,00;`
    const result = parseCreditAgricoleCsv(csv)
    assert.lengthOf(result, 1)
    assert.equal(result[0].montant, 20)
  })

  test('ignore les lignes ne contenant que des points-virgules', ({ assert }) => {
    const csv = `Date;Libellé;Débit euros;Crédit euros
01/07/2026;VALID;10,00;
;;;
02/07/2026;VALID2;5,00;`
    const result = parseCreditAgricoleCsv(csv)
    assert.lengthOf(result, 2)
  })

  test('ignore les lignes avec montant et debit/credit vides', ({ assert }) => {
    const csv = `Date;Libellé;Débit euros;Crédit euros
01/07/2026;SANS MONTANT;;`
    const result = parseCreditAgricoleCsv(csv)
    assert.lengthOf(result, 0)
  })

  // ─── Gestion des dates ───────────────────────────────────────────────────────

  test('retourne une dateError pour un format de date invalide', ({ assert }) => {
    const csv = `Date;Libellé;Débit euros;Crédit euros
2026-07-01;FORMAT ISO;10,00;`
    const result = parseCreditAgricoleCsv(csv)
    assert.lengthOf(result, 1)
    assert.isNull(result[0].date)
    assert.isString(result[0].dateError)
    assert.include(result[0].dateError!, 'Format de date invalide')
  })

  test('retourne une dateError pour une date vide', ({ assert }) => {
    const csv = `Date;Libellé;Débit euros;Crédit euros
;DATE VIDE;10,00;`
    const result = parseCreditAgricoleCsv(csv)
    assert.lengthOf(result, 1)
    assert.isNull(result[0].date)
    assert.equal(result[0].dateError, 'Date vide')
  })

  test('retourne une dateError pour une date impossible (31/02)', ({ assert }) => {
    const csv = `Date;Libellé;Débit euros;Crédit euros
31/02/2026;DATE IMPOSSIBLE;10,00;`
    const result = parseCreditAgricoleCsv(csv)
    assert.lengthOf(result, 1)
    assert.isNull(result[0].date)
    assert.isString(result[0].dateError)
  })

  test('accepte une date valide en fin de mois (28/02)', ({ assert }) => {
    const csv = `Date;Libellé;Débit euros;Crédit euros
28/02/2026;FIN FEVRIER;10,00;`
    const result = parseCreditAgricoleCsv(csv)
    assert.equal(result[0].date, '2026-02-28')
    assert.isUndefined(result[0].dateError)
  })

  // ─── Gestion des montants ────────────────────────────────────────────────────

  test('parse les montants avec virgule comme separateur decimal', ({ assert }) => {
    const csv = `Date;Libellé;Débit euros;Crédit euros
01/07/2026;VIRGULE;1234,56;`
    const result = parseCreditAgricoleCsv(csv)
    assert.equal(result[0].montant, 1234.56)
  })

  test('parse les montants avec point comme separateur decimal', ({ assert }) => {
    const csv = `Date;Libellé;Débit euros;Crédit euros
01/07/2026;POINT;99.99;`
    const result = parseCreditAgricoleCsv(csv)
    assert.equal(result[0].montant, 99.99)
  })

  test('retourne 0 pour un montant vide', ({ assert }) => {
    const csv = `Date;Libellé;Débit euros;Crédit euros
01/07/2026;ZERO;;0`
    const result = parseCreditAgricoleCsv(csv)
    // montant 0 credit + montant debit vide => ignored car montant === 0 && !debit && !credit n'est pas le cas
    // credit = "0", donc montant = 0, non ignoré
    assert.lengthOf(result, 1)
    assert.equal(result[0].montant, 0)
  })

  // ─── Fichier vide / edge cases ───────────────────────────────────────────────

  test('retourne un tableau vide pour un CSV sans lignes de données', ({ assert }) => {
    const csv = `Date;Libellé;Débit euros;Crédit euros`
    const result = parseCreditAgricoleCsv(csv)
    assert.lengthOf(result, 0)
  })

  test('conserve rawDate tel quel', ({ assert }) => {
    const csv = `Date;Libellé;Débit euros;Crédit euros
01/07/2026;TEST;10,00;`
    const result = parseCreditAgricoleCsv(csv)
    assert.equal(result[0].rawDate, '01/07/2026')
  })

  test('description est toujours null', ({ assert }) => {
    const csv = `Date;Libellé;Débit euros;Crédit euros
01/07/2026;TEST;10,00;`
    const result = parseCreditAgricoleCsv(csv)
    assert.isNull(result[0].description)
  })

  test('libelle est trimme des espaces', ({ assert }) => {
    const csv = `Date;Libellé;Débit euros;Crédit euros
01/07/2026;  SPACES  ;10,00;`
    const result = parseCreditAgricoleCsv(csv)
    assert.equal(result[0].libelle, 'SPACES')
  })
})
