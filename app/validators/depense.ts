import vine from '@vinejs/vine'

export const indexDepenseValidator = vine.create({
  periode: vine.enum(['today', 'week', 'month', 'custom']).optional(),
  dateDebut: vine.string().optional(),
  dateFin: vine.string().optional(),
})

export const createDepenseValidator = vine.create({
  date: vine.string(),
  libelle: vine.string().trim().minLength(1).maxLength(255),
  montant: vine.number().min(0.01),
  type: vine.enum(['entree', 'sortie']),
  categorieId: vine.number().optional(),
  description: vine.string().trim().maxLength(1000).optional(),
})

export const updateDepenseValidator = vine.create({
  date: vine.string().optional(),
  libelle: vine.string().trim().minLength(1).maxLength(255).optional(),
  montant: vine.number().min(0.01).optional(),
  type: vine.enum(['entree', 'sortie']).optional(),
  categorieId: vine.number().optional(),
  description: vine.string().trim().maxLength(1000).optional(),
})
