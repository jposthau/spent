export type WageType = 'HOURLY' | 'SALARY';

export interface User {
  id: number;
  wageType: WageType;
  hourlyRate: number | null;
  annualSalary: number | null;
  hoursPerWeek: number;
  weeksPerYear: number;
}

export interface CreateUserRequest {
  wageType: WageType;
  hourlyRate: number | null;
  annualSalary: number | null;
  hoursPerWeek: number;
  weeksPerYear: number;
}
