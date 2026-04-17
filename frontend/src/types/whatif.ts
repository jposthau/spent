export type CostType = 'MONTHLY' | 'ANNUAL' | 'ONE_TIME';

export interface WhatIfRequest {
  itemName: string;
  costType: CostType;
  amount: number;
  years: number;
}

export interface WhatIfResult {
  itemName: string;
  costType: CostType;
  amount: number;
  years: number;
  totalCost: number;
  annualCost: number;
  totalHoursWorked: number;
  workdays: number;
  workweeks: number;
  monthlyHours: number;
  percentageOfAnnualIncome: number;
  isSignificantCost: boolean;
}
