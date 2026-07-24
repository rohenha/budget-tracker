import type { HttpContext } from '@adonisjs/core/http'
import Categorie from '#models/categorie'
import { parseCreditAgricoleCsv } from '#services/csv_parser'
import { importUploadValidator } from '#validators/depense'
import fs from 'node:fs/promises'

export default class DepensesImportController {
  async upload({ request, response, session }: HttpContext) {
    const { file } = await request.validateUsing(importUploadValidator)
    await file.move('tmp')
    const content = await fs.readFile(file.filePath!, 'utf-8')
    const transactions = parseCreditAgricoleCsv(content)
    const errorCount = transactions.filter((t) => t.dateError).length

    if (transactions.length === 0) {
      session.flash('error', 'Le fichier CSV est vide ou ne contient aucune transaction valide')
      return response.redirect().toRoute('depenses')
    }

    session.flash('importData', {
      transactions,
      fileName: file.clientName,
      errorCount,
    } as any)

    return response.redirect().toRoute('depenses.import')
  }

  async review({ inertia, session, auth, response }: HttpContext) {
    const user = auth.user!
    const importData = session.pull('importData') as
      { transactions: any[]; fileName: string; errorCount: number } | undefined

    if (!importData) {
      session.flash('error', "Aucune donnée d'import à revoir")
      return response.redirect().toRoute('depenses')
    }

    const categories = await Categorie.query().where('userId', user.id).orderBy('createdAt', 'asc')

    return inertia.render('depenses/import', {
      transactions: importData.transactions,
      categories: categories.map((c) => c.serialize()) as any,
      fileName: importData.fileName,
      errorCount: importData.errorCount,
    })
  }
}
