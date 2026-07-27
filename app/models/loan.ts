import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from '#models/user'

type InstallmentRow = {
  installmentNumber: number
  dueDate: string
  principalAmount: number
  interest: number
  totalPayment: number
  remainingBalance: number
}

export default class Loan extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number

  @column()
  declare name: string

  @column({ serialize: (v: string | null) => (v ? Number(v) : 0) })
  declare borrowedAmount: number

  @column({ serialize: (v: string | null) => (v ? Number(v) : 0) })
  declare downPayment: number

  @column({ serialize: (v: string | null) => (v ? Number(v) : 0) })
  declare interestRate: number

  @column()
  declare durationMonths: number

  @column()
  declare status: 'active' | 'paid'

  @column.date()
  declare startDate: DateTime

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  get monthlyPayment(): number {
    const principal = Number(this.borrowedAmount)
    if (principal === 0) return 0
    const annualRate = Number(this.interestRate)
    if (annualRate === 0) return principal / this.durationMonths
    const monthlyRate = annualRate / 100 / 12
    const n = this.durationMonths
    return (
      (principal * monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1)
    )
  }

  get totalInterest(): number {
    if (Number(this.interestRate) === 0) return 0
    return this.monthlyPayment * this.durationMonths - Number(this.borrowedAmount)
  }

  get totalPaid(): number {
    return this.monthlyPayment * this.durationMonths
  }

  get remainingBalance(): number {
    if (this.status === 'paid') return 0
    return Number(this.borrowedAmount)
  }

  schedule(): InstallmentRow[] {
    const principal = Number(this.borrowedAmount)
    if (principal === 0) return []
    const annualRate = Number(this.interestRate)
    const monthlyRate = annualRate / 100 / 12
    const n = this.durationMonths
    const payment = this.monthlyPayment
    const rows: InstallmentRow[] = []
    let balance = principal

    for (let i = 1; i <= n; i++) {
      const interest = balance * monthlyRate
      let principalAmount = payment - interest
      if (annualRate === 0) {
        principalAmount = principal / n
      }
      balance -= principalAmount
      if (i === n) {
        principalAmount += balance
        balance = 0
      }
      rows.push({
        installmentNumber: i,
        dueDate: this.startDate.plus({ months: i }).toISODate()!,
        principalAmount: Math.round(principalAmount * 100) / 100,
        interest: Math.round(interest * 100) / 100,
        totalPayment: Math.round((principalAmount + interest) * 100) / 100,
        remainingBalance: Math.round(balance * 100) / 100,
      })
    }

    return rows
  }

  settled(): { currentPaid: number; currentInterest: number } {
    const schedule = this.schedule()
    const now = DateTime.now().toISODate()

    const scheduleFiltered = schedule.filter((item) => item.dueDate < now)
    return scheduleFiltered.reduce(
      (data, item) => {
        ;((data.currentPaid += item.principalAmount), (data.currentInterest += item.interest))
        return data
      },
      {
        currentPaid: 0,
        currentInterest: 0,
      }
    )
  }
}
