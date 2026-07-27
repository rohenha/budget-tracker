import vine from '@vinejs/vine'

export const storeLoanValidator = vine.create({
  name: vine.string().trim().minLength(1).maxLength(255),
  borrowedAmount: vine.number().min(0.01),
  downPayment: vine.number().min(0).optional(),
  interestRate: vine.number().min(0),
  durationMonths: vine.number().min(1),
  status: vine.enum(['active', 'paid']).optional(),
  startDate: vine.date({ formats: 'YYYY-MM-DD' }),
})

export const updateLoanValidator = vine.create({
  name: vine.string().trim().minLength(1).maxLength(255).optional(),
  borrowedAmount: vine.number().min(0.01).optional(),
  downPayment: vine.number().min(0).optional(),
  interestRate: vine.number().min(0).optional(),
  durationMonths: vine.number().min(1).optional(),
  status: vine.enum(['active', 'paid']).optional(),
  startDate: vine.date({ formats: 'YYYY-MM-DD' }).optional(),
})
