import { useEffect, useState } from 'react';
import { getAudit, getNarrative } from '../api/audit';
import { getNarrativeCache, setNarrativeCache, clearNarrativeCache } from '../utils/storage';
import { useAuth } from '../context/AuthContext';
import { useIsMobile } from '../hooks/useWindowWidth';
import { usd, hrs, dec } from '../utils/format';
import type { AuditSummary, ExpenseSummary } from '../types/audit';
import type { Category } from '../types/expense';

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

function MetricCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div style={{ backgroundColor: '#141414', border: '1px solid #242424', borderRadius: '14px', padding: '20px' }}>
      <p style={{ fontSize: '12px', color: '#737373', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>{label}</p>
      <p style={{ fontSize: '28px', fontWeight: 700, color: '#f5f5f5', letterSpacing: '-0.03em', lineHeight: 1 }}>{value}</p>
      {sub && <p style={{ fontSize: '12px', color: '#525252', marginTop: '6px' }}>{sub}</p>}
    </div>
  );
}

function WorkdayBar({ breakdown, totalAnnualExpenses, breakEvenHour }: {
  breakdown: ExpenseSummary[];
  totalAnnualExpenses: number;
  breakEvenHour: number;
}) {
  const filledPct = Math.min((breakEvenHour / 8) * 100, 100);

  return (
    <div style={{ backgroundColor: '#141414', border: '1px solid #242424', borderRadius: '14px', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '14px' }}>
        <p style={{ fontSize: '13px', fontWeight: 600, color: '#a3a3a3', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Your Workday</p>
        <p style={{ fontSize: '13px', color: '#737373' }}>
          {breakEvenHour > 8
            ? 'Expenses exceed a full 8h day'
            : `Free after ${hrs(breakEvenHour)}`}
        </p>
      </div>
      <div style={{ height: '36px', backgroundColor: '#0f0f0f', borderRadius: '8px', overflow: 'hidden', display: 'flex', border: '1px solid #1f1f1f' }}>
        {/* Expense segments */}
        {breakdown.map(e => {
          const segPct = totalAnnualExpenses > 0
            ? (e.annualCost / totalAnnualExpenses) * filledPct
            : 0;
          return (
            <div
              key={e.name}
              title={`${e.name}: ${hrs(e.hoursWorked)}/yr`}
              style={{
                width: `${segPct}%`,
                backgroundColor: CATEGORY_COLORS[e.category],
                transition: 'width 0.5s',
                flexShrink: 0,
              }}
            />
          );
        })}
        {/* Free time */}
        <div style={{ flex: 1, backgroundColor: 'transparent' }} />
      </div>
      {/* Hour labels */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px' }}>
        {[0, 2, 4, 6, 8].map(h => (
          <span key={h} style={{ fontSize: '11px', color: '#525252' }}>{h}h</span>
        ))}
      </div>
      {/* Legend */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 14px', marginTop: '14px', overflowX: 'hidden' }}>
        {breakdown.map(e => (
          <div key={e.name} style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0, flexShrink: 1 }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '2px', backgroundColor: CATEGORY_COLORS[e.category], flexShrink: 0 }} />
            <span style={{ fontSize: '12px', color: '#737373', whiteSpace: 'nowrap' }}>{e.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function weekColor(
  index: number,
  breakdown: ExpenseSummary[],
  totalAnnualExpenses: number,
  weeksWorked: number,
): string | null {
  if (index >= Math.min(weeksWorked, 52)) return null;
  let cursor = 0;
  for (const expense of breakdown) {
    cursor += (expense.annualCost / totalAnnualExpenses) * Math.min(weeksWorked, 52);
    if (index < cursor) return CATEGORY_COLORS[expense.category];
  }
  return null;
}

function WeekGrid({ weeksWorked, breakdown, totalAnnualExpenses }: {
  weeksWorked: number;
  breakdown: ExpenseSummary[];
  totalAnnualExpenses: number;
}) {
  const filled = Math.min(Math.round(weeksWorked), 52);

  return (
    <div style={{ backgroundColor: '#141414', border: '1px solid #242424', borderRadius: '14px', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '14px' }}>
        <p style={{ fontSize: '13px', fontWeight: 600, color: '#a3a3a3', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Your Year</p>
        <p style={{ fontSize: '13px', color: '#737373' }}>
          {filled} of 52 weeks spent on expenses
        </p>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px' }}>
        {Array.from({ length: 52 }, (_, i) => {
          const color = weekColor(i, breakdown, totalAnnualExpenses, weeksWorked);
          return (
            <div
              key={i}
              title={`Week ${i + 1}`}
              style={{
                width: '14px',
                height: '14px',
                borderRadius: '3px',
                flexShrink: 0,
                backgroundColor: color ?? '#1f1f1f',
                border: `1px solid ${color ? 'transparent' : '#2d2d2d'}`,
              }}
            />
          );
        })}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 14px', marginTop: '12px' }}>
        {breakdown.map(e => (
          <div key={e.name} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '2px', backgroundColor: CATEGORY_COLORS[e.category], flexShrink: 0 }} />
            <span style={{ fontSize: '12px', color: '#737373', whiteSpace: 'nowrap' }}>{e.name}</span>
          </div>
        ))}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '2px', backgroundColor: '#1f1f1f', border: '1px solid #2d2d2d', flexShrink: 0 }} />
          <span style={{ fontSize: '12px', color: '#737373', whiteSpace: 'nowrap' }}>Yours to keep</span>
        </div>
      </div>
    </div>
  );
}

function ExpenseBreakdown({ breakdown }: { breakdown: ExpenseSummary[]; totalAnnualExpenses: number }) {
  const sorted = [...breakdown].sort((a, b) => b.annualCost - a.annualCost);

  return (
    <div style={{ backgroundColor: '#141414', border: '1px solid #242424', borderRadius: '14px', padding: '20px' }}>
      <p style={{ fontSize: '13px', fontWeight: 600, color: '#a3a3a3', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '14px' }}>Expense Breakdown</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {sorted.map(e => (
          <div key={e.name}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '5px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: CATEGORY_COLORS[e.category], flexShrink: 0 }} />
                <span style={{ fontSize: '14px', color: '#f5f5f5', fontWeight: 500 }}>{e.name}</span>
                <span style={{ fontSize: '11px', color: '#525252', backgroundColor: '#1a1a1a', padding: '1px 7px', borderRadius: '20px' }}>
                  {CATEGORY_LABELS[e.category]}
                </span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '14px', fontWeight: 600, color: '#f5f5f5' }}>{hrs(e.hoursWorked)}/yr</span>
                <span style={{ fontSize: '12px', color: '#525252', marginLeft: '8px' }}>{usd(e.annualCost)}</span>
              </div>
            </div>
            <div style={{ height: '4px', backgroundColor: '#1f1f1f', borderRadius: '2px', overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                width: `${e.percentageOfTotalExpenses}%`,
                backgroundColor: CATEGORY_COLORS[e.category],
                borderRadius: '2px',
              }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AuditPage() {
  const { user } = useAuth();
  const userId = user!.id;
  const isMobile = useIsMobile();
  const [audit, setAudit] = useState<AuditSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [narrative, setNarrative] = useState<string | null>(
    getNarrativeCache(userId)
  );
  const [narrativeLoading, setNarrativeLoading] = useState(false);
  const [narrativeError, setNarrativeError] = useState('');

  const handleGenerateNarrative = () => {
    setNarrativeLoading(true);
    setNarrativeError('');
    getNarrative(userId)
      .then(text => {
        setNarrative(text);
        setNarrativeCache(userId, text);
      })
      .catch(() => setNarrativeError('Failed to generate narrative. Check that your Anthropic API key is configured.'))
      .finally(() => setNarrativeLoading(false));
  };

  useEffect(() => {
    getAudit(userId)
      .then(setAudit)
      .catch(() => setError('Failed to load audit data.'))
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '300px', color: '#737373', fontSize: '14px' }}>
        Loading…
      </div>
    );
  }

  if (error || !audit) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '300px', color: '#f87171', fontSize: '14px' }}>
        {error || 'No data found.'}
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '36px 16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ marginBottom: '8px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '4px' }}>Audit</h1>
        <p style={{ color: '#737373', fontSize: '14px' }}>Your financial life in hours.</p>
      </div>

      {/* Metric cards */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: '12px' }}>
        <MetricCard
          label="True Hourly Rate"
          value={usd(audit.trueHourlyRate)}
          sub={`${usd(audit.grossAnnualIncome)} gross → ${usd(audit.netAnnualIncome)} net`}
        />
        <MetricCard
          label="Break-Even Hour"
          value={`${dec(audit.breakEvenHour)}h`}
          sub="Hours into each day before you keep money"
        />
        <MetricCard
          label="Weeks for Expenses"
          value={`${dec(audit.weeksWorkedForExpenses)} wks`}
          sub={`${dec(audit.percentageOfIncomeToExpenses)}% of net income`}
        />
        <MetricCard
          label="Weeks Kept"
          value={`${dec(audit.weeksKept)} wks`}
          sub={`${dec(audit.annualHours)} hrs/yr · ${usd(audit.totalMonthlyExpenses)}/mo expenses`}
        />
      </div>

      <WorkdayBar
        breakdown={audit.expenseBreakdown}
        totalAnnualExpenses={audit.totalAnnualExpenses}
        breakEvenHour={audit.breakEvenHour}
      />

      <WeekGrid
        weeksWorked={audit.weeksWorkedForExpenses}
        breakdown={audit.expenseBreakdown}
        totalAnnualExpenses={audit.totalAnnualExpenses}
      />

      <ExpenseBreakdown
        breakdown={audit.expenseBreakdown}
        totalAnnualExpenses={audit.totalAnnualExpenses}
      />

      {/* AI Audit */}
      <div style={{ backgroundColor: '#141414', border: '1px solid #242424', borderRadius: '14px', padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: narrative || narrativeLoading || narrativeError ? '20px' : '0' }}>
          <div>
            <p style={{ fontSize: '13px', fontWeight: 600, color: '#a3a3a3', textTransform: 'uppercase', letterSpacing: '0.06em' }}>AI Audit</p>
            <p style={{ fontSize: '12px', color: '#525252', marginTop: '4px' }}>Your financial story in plain English</p>
          </div>
          {!narrative && (
            <button
              onClick={handleGenerateNarrative}
              disabled={narrativeLoading}
              style={{
                backgroundColor: narrativeLoading ? '#1c1a17' : '#f59e0b',
                color: narrativeLoading ? '#525252' : '#0f0f0f',
                border: narrativeLoading ? '1px solid #292524' : 'none',
                borderRadius: '8px',
                padding: '10px 18px',
                fontSize: '13px',
                fontWeight: 600,
                cursor: narrativeLoading ? 'not-allowed' : 'pointer',
                transition: 'background-color 0.15s',
                flexShrink: 0,
              }}
            >
              {narrativeLoading ? 'Generating…' : 'Generate My Audit'}
            </button>
          )}
        </div>

        {narrativeError && (
          <p style={{ color: '#f87171', fontSize: '13px', lineHeight: 1.6 }}>{narrativeError}</p>
        )}

        {narrative && (
          <div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {narrative.split('\n\n').filter(p => p.trim()).map((para, i) => (
                <p
                  key={i}
                  style={{ fontSize: '15px', lineHeight: '1.75', color: '#d4d4d4', margin: 0 }}
                >
                  {para.trim()}
                </p>
              ))}
            </div>
            <button
              onClick={() => { setNarrative(null); setNarrativeError(''); clearNarrativeCache(userId); }}
              style={{
                marginTop: '20px',
                background: 'none',
                border: '1px solid #2d2d2d',
                borderRadius: '8px',
                padding: '8px 14px',
                fontSize: '12px',
                color: '#737373',
                cursor: 'pointer',
              }}
            >
              Regenerate
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
