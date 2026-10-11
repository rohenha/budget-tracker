import vine from '@vinejs/vine'

export const storeInvestmentSupportValidator = vine.create({
  symbol: vine.string().trim().minLength(1).maxLength(10).regex(/^[A-Za-z0-9.^=]+$/),
  name: vine.string().trim().minLength(1).maxLength(255),
  type: vine.enum(['PEA', 'AV', 'CTO']),
  storageLocation: vine.string().trim().minLength(1).maxLength(255),
  annualFees: vine.number().min(0).max(100).optional(),
  description: vine.string().nullable().optional(),
  externalLink: vine.string().url().nullable().optional(),
})

export const updateInvestmentSupportValidator = vine.create({
  symbol: vine.string().trim().minLength(1).maxLength(10).regex(/^[A-Za-z0-9.^=]+$/).optional(),
  name: vine.string().trim().minLength(1).maxLength(255).optional(),
  type: vine.enum(['PEA', 'AV', 'CTO']).optional(),
  storageLocation: vine.string().trim().minLength(1).maxLength(255).optional(),
  annualFees: vine.number().min(0).max(100).optional(),
  description: vine.string().nullable().optional(),
  externalLink: vine.string().url().nullable().optional(),
})