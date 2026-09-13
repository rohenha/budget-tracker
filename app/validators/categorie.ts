import vine from '@vinejs/vine'

export const indexCategorieValidator = vine.create({
  mois: vine
    .string()
    .trim()
    .regex(/^\d{4}-(0[1-9]|1[0-2])$/)
    .optional(),
})

export const createCategorieValidator = vine.create({
  label: vine.string().trim().minLength(1).maxLength(100),
  slug: vine.string().trim().minLength(1).maxLength(100).optional(),
  icon: vine.string().trim().minLength(1).maxLength(50),
  budget: vine.number().min(0).optional(),
  type: vine.enum(['entree', 'sortie']),
  color: vine
    .string()
    .trim()
    .regex(/^#[0-9a-fA-F]{6}$/),
})

export const updateCategorieValidator = vine.create({
  label: vine.string().trim().minLength(1).maxLength(100).optional(),
  slug: vine.string().trim().minLength(1).maxLength(100).optional(),
  icon: vine.string().trim().minLength(1).maxLength(50).optional(),
  budget: vine.number().min(0).optional(),
  type: vine.enum(['entree', 'sortie']).optional(),
  color: vine
    .string()
    .trim()
    .regex(/^#[0-9a-fA-F]{6}$/)
    .optional(),
})
