import client from './client';
import type { Expense, CreateExpenseRequest } from '../types/expense';

export const addExpense = (userId: number, data: CreateExpenseRequest) =>
  client.post<Expense>(`/api/users/${userId}/expenses`, data).then(r => r.data);

export const getExpenses = (userId: number) =>
  client.get<Expense[]>(`/api/users/${userId}/expenses`).then(r => r.data);

export const updateExpense = (userId: number, expenseId: number, data: CreateExpenseRequest) =>
  client.put<Expense>(`/api/users/${userId}/expenses/${expenseId}`, data).then(r => r.data);

export const deleteExpense = (userId: number, expenseId: number) =>
  client.delete(`/api/users/${userId}/expenses/${expenseId}`);
