import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addExpense, deleteExpense, getExpenses } from '../api/expenses';
import { useAuth } from '../context/AuthContext';
import { usd } from '../utils/format';
import type { Category, Expense } from '../types/expense';

const CATEGORIES: Category[] = [
  'HOUSING', 'TRANSPORTATION', 'FOOD', 'INSURANCE',
  'SUBSCRIPTIONS', 'CHILDCARE', 'DEBT', 'OTHER',
];

const CATEGORY_COLORS: Record<Category, string> = {
  HOUSING: '#3b82f6',
  TRANSPORTATION: '#8b5cf6',
  FOOD: '#22c55e',
  INSURANCE: '#eab308',
  SUBSCRIPTIONS: '#ec4899',
  CHILDCARE: '#f97316',
  DEBT: '#ef4444',
  OTHER: '#6b7280',
};

const CATEGORY_LABELS: Record<Category, string> = {
  HOUSING: 'Housing',
  TRANSPORTATION: 'Transportation',
  FOOD: 'Food',
  INSURANCE: 'Insurance',
  SUBSCRIPTIONS: 'Subscriptions',
  CHILDCARE: 'Childcare',
  DEBT: 'Debt',
  OTHER: 'Other',
};

const inputStyle: React.CSSProperties = {
  backgroundColor: '#1a1a1a',
  border: '1px solid #2d2d2d',
  borderRadius: '8px',
  padding: '9px 12px',
  color: '#f5f5f5',
  fontSize: '14px',
  outline: 'none',
};

export default function ExpensesPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const userId = user!.id;

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [name, setName] = useState('');
  const [category, setCategory] = useState<Category>('HOUSING');
  const [monthlyAmount, setMonthlyAmount] = useState('');
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    getExpenses(userId).then(setExpenses);
  }, [userId]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    setAdding(true);
    try {
      const expense = await addExpense(userId, {
        name,
        category,
        monthlyAmount: parseFloat(monthlyAmount),
      });
      setExpenses(prev => [...prev, expense]);
      setName('');
      setMonthlyAmount('');
      setCategory('HOUSING');
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (expenseId: number) => {
    if (!userId) return;
    await deleteExpense(userId, expenseId);
    setExpenses(prev => prev.filter(e => e.id !== expenseId));
  };

  const totalMonthly = expenses.reduce((sum, e) => sum + e.monthlyAmount, 0);

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto', padding: '36px 16px' }}>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '4px' }}>Expenses</h1>
        <p style={{ color: '#737373', fontSize: '14px' }}>Add your recurring monthly costs.</p>
      </div>

      {/* Add form */}
      <div style={{ backgroundColor: '#141414', border: '1px solid #242424', borderRadius: '14px', padding: '20px', marginBottom: '24px' }}>
        <p style={{ fontSize: '13px', fontWeight: 600, color: '#a3a3a3', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Add Expense</p>
        <form onSubmit={handleAdd} style={{ display: 'grid', gridTemplateColumns: '1fr auto auto auto', gap: '10px', alignItems: 'end' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', color: '#737373', marginBottom: '5px' }}>Name</label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Rent"
              required
              style={{ ...inputStyle, width: '100%' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '12px', color: '#737373', marginBottom: '5px' }}>Category</label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value as Category)}
              style={{ ...inputStyle, appearance: 'none', paddingRight: '28px', backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23737373' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center' }}
            >
              {CATEGORIES.map(c => (
                <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '12px', color: '#737373', marginBottom: '5px' }}>Monthly ($)</label>
            <input
              type="number"
              value={monthlyAmount}
              onChange={e => setMonthlyAmount(e.target.value)}
              placeholder="0.00"
              required
              min="0"
              step="0.01"
              style={{ ...inputStyle, width: '120px' }}
            />
          </div>
          <button
            type="submit"
            disabled={adding}
            style={{
              padding: '9px 18px',
              backgroundColor: '#f59e0b',
              color: '#000',
              fontWeight: 700,
              fontSize: '13px',
              borderRadius: '8px',
              border: 'none',
              cursor: adding ? 'not-allowed' : 'pointer',
              whiteSpace: 'nowrap',
              opacity: adding ? 0.7 : 1,
            }}
          >
            + Add
          </button>
        </form>
      </div>

      {/* Expenses list */}
      {expenses.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px', color: '#525252', fontSize: '14px' }}>
          No expenses yet. Add one above.
        </div>
      ) : (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {expenses.map(expense => (
              <div
                key={expense.id}
                style={{
                  backgroundColor: '#141414',
                  border: '1px solid #242424',
                  borderRadius: '12px',
                  padding: '16px 18px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                }}
              >
                <div
                  style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    backgroundColor: CATEGORY_COLORS[expense.category],
                    flexShrink: 0,
                  }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontWeight: 600, fontSize: '14px', color: '#f5f5f5', marginBottom: '2px' }}>{expense.name}</p>
                  <p style={{ fontSize: '12px', color: '#525252' }}>{CATEGORY_LABELS[expense.category]}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontWeight: 700, fontSize: '15px', color: '#f5f5f5' }}>{usd(expense.monthlyAmount)}</p>
                  <p style={{ fontSize: '11px', color: '#525252' }}>/ month</p>
                </div>
                <button
                  onClick={() => handleDelete(expense.id)}
                  style={{
                    background: 'none',
                    border: '1px solid #2d2d2d',
                    borderRadius: '6px',
                    padding: '5px 10px',
                    color: '#737373',
                    fontSize: '12px',
                    cursor: 'pointer',
                    flexShrink: 0,
                  }}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          {/* Footer summary */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', padding: '14px 18px', backgroundColor: '#141414', border: '1px solid #242424', borderRadius: '10px' }}>
            <span style={{ fontSize: '13px', color: '#737373' }}>{expenses.length} expense{expenses.length !== 1 ? 's' : ''}</span>
            <span style={{ fontWeight: 700, fontSize: '15px', color: '#f59e0b' }}>{usd(totalMonthly)} / month</span>
          </div>

          <button
            onClick={() => navigate('/audit')}
            style={{
              marginTop: '20px',
              width: '100%',
              padding: '11px',
              backgroundColor: '#f59e0b',
              color: '#000',
              fontWeight: 700,
              fontSize: '14px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            View Audit →
          </button>
        </>
      )}
    </div>
  );
}
