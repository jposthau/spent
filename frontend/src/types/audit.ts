import type { Category } from './expense';

export interface ExpenseSummary {
  name: string;
  category: Category;
  monthlyAmount: number;
  annualCost: number;
  hoursWorked: number;
  percentageOfTotalExpenses: number;
}

export interface AuditSummary {
  trueHourlyRate: number;
  grossAnnualIncome: number;
  netAnnualIncome: number;
  annualHours: number;
  totalMonthlyExpenses: number;
  totalAnnualExpenses: number;
  totalHoursForExpenses: number;
  weeksWorkedForExpenses: number;
  breakEvenHour: number;
  weeksKept: number;
  percentageOfIncomeToExpenses: number;
  expenseBreakdown: ExpenseSummary[];
}
