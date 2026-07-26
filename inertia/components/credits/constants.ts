export type InstallmentRow = {
  installmentNumber: number
  dueDate: string
  principalAmount: number
  interest: number
  totalPayment: number
  remainingBalance: number
}

export type Loan = {
  id: number
  userId: number
  name: string
  borrowedAmount: number
  downPayment: number
  interestRate: number
  durationMonths: number
  settled: { currentPaid: number; currentInterest: number }
  status: 'active' | 'paid'
  startDate: string
  monthlyPayment: number
  totalInterest: number
  totalPaid: number
  remainingBalance: number
  schedule?: InstallmentRow[]
}

export type GlobalSummary = {
  totalBorrowed: number
  totalInterest: number
  totalPaid: number
  currentPaid: number
  currentInterest: number
}
