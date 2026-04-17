export type Category =
  | 'HOUSING'
  | 'TRANSPORTATION'
  | 'FOOD'
  | 'INSURANCE'
  | 'SUBSCRIPTIONS'
  | 'CHILDCARE'
  | 'DEBT'
  | 'OTHER';

export interface Expense {
  id: number;
  name: string;
  category: Category;
  monthlyAmount: number;
}

export interface CreateExpenseRequest {
  name: string;
  category: Category;
  monthlyAmount: number;
}
