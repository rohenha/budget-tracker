import vine from '@vinejs/vine'

export const storeInvestmentSupportValidator = vine.create({
  symbol: vine
    .string()
    .trim()
    .minLength(1)
    .maxLength(10)
    .regex(/^[A-Za-z0-9.^=]+$/),
  name: vine.string().trim().minLength(1).maxLength(255),
  type: vine.enum(['PEA', 'AV', 'CTO']),
  storageLocation: vine.string().trim().minLength(1).maxLength(255),
  annualFees: vine.number().min(0).max(100).optional(),
  description: vine.string().nullable().optional(),
  externalLink: vine.string().url().nullable().optional(),
})

export const updateInvestmentSupportValidator = vine.create({
  symbol: vine
    .string()
    .trim()
    .minLength(1)
    .maxLength(10)
    .regex(/^[A-Za-z0-9.^=]+$/)
    .optional(),
  name: vine.string().trim().minLength(1).maxLength(255).optional(),
  type: vine.enum(['PEA', 'AV', 'CTO']).optional(),
  storageLocation: vine.string().trim().minLength(1).maxLength(255).optional(),
  annualFees: vine.number().min(0).max(100).optional(),
  description: vine.string().nullable().optional(),
  externalLink: vine.string().url().nullable().optional(),
})

export const searchInvestmentSupportValidator = vine.compile(
  vine.object({
    q: vine.string().trim().minLength(2).maxLength(100),
  })
)

const notFuture = vine.createRule((value: unknown) => {
  if (typeof value === 'string' || value instanceof Date) {
    const date = new Date(value)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    if (date > today) {
      return 'La date ne peut pas être dans le futur'
    }
  }
})

export const storeInvestmentTransactionValidator = vine.create({
  type: vine.enum(['achat', 'vente']),
  date: vine.date().use(notFuture()),
  quantity: vine.number().min(0.00000001),
  price: vine.number().min(0.01),
  fees: vine.number().min(0).optional(),
  notes: vine.string().nullable().optional(),
})

export const updateInvestmentTransactionValidator = vine.create({
  type: vine.enum(['achat', 'vente']).optional(),
  date: vine.date().use(notFuture()).optional(),
  quantity: vine.number().min(0.00000001).optional(),
  price: vine.number().min(0.01).optional(),
  fees: vine.number().min(0).optional(),
  notes: vine.string().nullable().optional(),
})
