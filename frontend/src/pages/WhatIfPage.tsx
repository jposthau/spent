import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { calculateWhatIf } from '../api/whatif';
import { getUserId } from '../utils/storage';
import { usd, hrs, dec } from '../utils/format';
import type { CostType, WhatIfRequest, WhatIfResult } from '../types/whatif';

const COST_TYPE_LABELS: Record<CostType, string> = {
  MONTHLY: 'Monthly',
  ANNUAL: 'Annual',
  ONE_TIME: 'One-Time',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  backgroundColor: '#1a1a1a',
  border: '1px solid #2d2d2d',
  borderRadius: '8px',
  padding: '10px 12px',
  color: '#f5f5f5',
  fontSize: '14px',
  outline: 'none',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '12px',
  color: '#737373',
  fontWeight: 500,
  marginBottom: '6px',
};

function ResultCard({ result }: { result: WhatIfResult }) {
  return (
    <div style={{ backgroundColor: '#141414', border: `1px solid ${result.isSignificantCost ? '#92400e' : '#242424'}`, borderRadius: '14px', padding: '24px', marginTop: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
        <div>
          <p style={{ fontSize: '18px', fontWeight: 700, color: '#f5f5f5', letterSpacing: '-0.02em' }}>{result.itemName}</p>
          <p style={{ fontSize: '13px', color: '#737373', marginTop: '2px' }}>
            {COST_TYPE_LABELS[result.costType]} · {result.years} year{result.years !== 1 ? 's' : ''}
          </p>
        </div>
        {result.isSignificantCost && (
          <span style={{
            backgroundColor: '#451a03',
            color: '#fbbf24',
            border: '1px solid #92400e',
            borderRadius: '20px',
            padding: '4px 12px',
            fontSize: '12px',
            fontWeight: 600,
          }}>
            Significant Cost
          </span>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '16px' }}>
        {[
          { label: 'Total Cost', value: usd(result.totalCost) },
          { label: 'Annual Cost', value: usd(result.annualCost) },
          { label: 'Total Hours Worked', value: hrs(result.totalHoursWorked) },
          { label: 'Monthly Hours', value: hrs(result.monthlyHours) },
          { label: 'Work Days', value: `${dec(result.workdays)} days` },
          { label: 'Work Weeks', value: `${dec(result.workweeks)} wks` },
        ].map(({ label, value }) => (
          <div key={label} style={{ backgroundColor: '#0f0f0f', borderRadius: '10px', padding: '14px' }}>
            <p style={{ fontSize: '11px', color: '#525252', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>{label}</p>
            <p style={{ fontSize: '20px', fontWeight: 700, color: '#f5f5f5', letterSpacing: '-0.02em' }}>{value}</p>
          </div>
        ))}
      </div>

      {/* Income percentage bar */}
      <div style={{ backgroundColor: '#0f0f0f', borderRadius: '10px', padding: '14px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <p style={{ fontSize: '12px', color: '#737373', fontWeight: 500 }}>% of Annual Net Income</p>
          <p style={{ fontSize: '14px', fontWeight: 700, color: result.isSignificantCost ? '#fbbf24' : '#f5f5f5' }}>
            {dec(result.percentageOfAnnualIncome)}%
          </p>
        </div>
        <div style={{ height: '6px', backgroundColor: '#1f1f1f', borderRadius: '3px', overflow: 'hidden' }}>
          <div style={{
            height: '100%',
            width: `${Math.min(result.percentageOfAnnualIncome, 100)}%`,
            backgroundColor: result.isSignificantCost ? '#f59e0b' : '#3b82f6',
            borderRadius: '3px',
            transition: 'width 0.5s',
          }} />
        </div>
        {result.isSignificantCost && (
          <p style={{ fontSize: '12px', color: '#92400e', marginTop: '8px' }}>
            This exceeds 5% of your net annual income.
          </p>
        )}
      </div>
    </div>
  );
}

export default function WhatIfPage() {
  const navigate = useNavigate();
  const userId = getUserId();

  const [form, setForm] = useState<WhatIfRequest>({
    itemName: '',
    costType: 'MONTHLY',
    amount: 0,
    years: 1,
  });
  const [amountStr, setAmountStr] = useState('');
  const [result, setResult] = useState<WhatIfResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!userId) {
    navigate('/');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await calculateWhatIf(userId, {
        ...form,
        amount: parseFloat(amountStr),
      });
      setResult(res);
    } catch {
      setError('Calculation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '560px', margin: '0 auto', padding: '36px 16px' }}>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '4px' }}>What If?</h1>
        <p style={{ color: '#737373', fontSize: '14px' }}>See any cost in hours of your life.</p>
      </div>

      <div style={{ backgroundColor: '#141414', border: '1px solid #242424', borderRadius: '14px', padding: '24px' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={labelStyle}>Item Name</label>
            <input
              value={form.itemName}
              onChange={e => setForm(f => ({ ...f, itemName: e.target.value }))}
              placeholder="e.g. New car, gym membership, vacation"
              required
              style={inputStyle}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={labelStyle}>Cost Type</label>
              <select
                value={form.costType}
                onChange={e => setForm(f => ({ ...f, costType: e.target.value as CostType }))}
                style={{ ...inputStyle, appearance: 'none', backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23737373' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center', paddingRight: '28px' }}
              >
                {(Object.keys(COST_TYPE_LABELS) as CostType[]).map(t => (
                  <option key={t} value={t}>{COST_TYPE_LABELS[t]}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Years</label>
              <input
                type="number"
                value={form.years}
                onChange={e => setForm(f => ({ ...f, years: parseInt(e.target.value, 10) || 1 }))}
                min="1"
                max="30"
                required
                style={inputStyle}
              />
            </div>
          </div>

          <div>
            <label style={labelStyle}>
              Amount ({form.costType === 'MONTHLY' ? 'per month' : form.costType === 'ANNUAL' ? 'per year' : 'total'})
            </label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#737373', fontSize: '14px' }}>$</span>
              <input
                type="number"
                value={amountStr}
                onChange={e => setAmountStr(e.target.value)}
                placeholder="0.00"
                required
                min="0"
                step="0.01"
                style={{ ...inputStyle, paddingLeft: '24px' }}
              />
            </div>
          </div>

          {error && <p style={{ color: '#f87171', fontSize: '13px' }}>{error}</p>}

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '11px',
              backgroundColor: loading ? '#92400e' : '#f59e0b',
              color: '#000',
              fontWeight: 700,
              fontSize: '14px',
              borderRadius: '8px',
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.8 : 1,
            }}
          >
            {loading ? 'Calculating…' : 'Calculate Cost in Hours'}
          </button>
        </form>
      </div>

      {result && <ResultCard result={result} />}
    </div>
  );
}
