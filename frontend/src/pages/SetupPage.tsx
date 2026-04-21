import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUser, updateUser } from '../api/users';
import { useAuth } from '../context/AuthContext';
import type { WageType } from '../types/user';

const input: React.CSSProperties = {
  width: '100%',
  backgroundColor: '#1a1a1a',
  border: '1px solid #2d2d2d',
  borderRadius: '8px',
  padding: '10px 12px',
  color: '#f5f5f5',
  fontSize: '15px',
  outline: 'none',
};

const label: React.CSSProperties = {
  display: 'block',
  fontSize: '13px',
  fontWeight: 500,
  color: '#a3a3a3',
  marginBottom: '6px',
};

const fieldWrap: React.CSSProperties = {
  marginBottom: '16px',
};

export default function SetupPage() {
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();

  const [wageType, setWageType]       = useState<WageType>('SALARY');
  const [annualSalary, setAnnualSalary] = useState('');
  const [hourlyRate, setHourlyRate]   = useState('');
  const [hoursPerWeek, setHoursPerWeek] = useState('40');
  const [weeksPerYear, setWeeksPerYear] = useState('50');
  const [loading, setLoading]         = useState(false);
  const [fetching, setFetching]       = useState(true);
  const [error, setError]             = useState('');

  // Pre-populate from saved data
  useEffect(() => {
    if (!user) return;
    getUser(user.id)
      .then(saved => {
        if (saved.wageType) setWageType(saved.wageType);
        if (saved.annualSalary)  setAnnualSalary(String(saved.annualSalary));
        if (saved.hourlyRate)    setHourlyRate(String(saved.hourlyRate));
        if (saved.hoursPerWeek)  setHoursPerWeek(String(saved.hoursPerWeek));
        if (saved.weeksPerYear)  setWeeksPerYear(String(saved.weeksPerYear));
      })
      .catch(() => { /* no saved data yet — defaults are fine */ })
      .finally(() => setFetching(false));
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await updateUser(user!.id, {
        wageType,
        hourlyRate:   wageType === 'HOURLY' ? parseFloat(hourlyRate)   : null,
        annualSalary: wageType === 'SALARY' ? parseFloat(annualSalary) : null,
        hoursPerWeek: parseInt(hoursPerWeek, 10),
        weeksPerYear: wageType === 'SALARY' ? 50 : parseInt(weeksPerYear, 10),
      });
      await refreshUser();
      navigate('/expenses');
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '300px', color: '#525252', fontSize: '14px' }}>
        Loading…
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 16px', flex: 1 }}>
      <div style={{ width: '100%', maxWidth: '440px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{ fontSize: '26px', fontWeight: 700, color: '#f5f5f5', letterSpacing: '-0.03em', marginBottom: '8px' }}>
            What do you earn?
          </h1>
          <p style={{ color: '#737373', fontSize: '14px' }}>
            We'll convert your finances into hours of work.
          </p>
        </div>

        <div style={{ backgroundColor: '#141414', border: '1px solid #242424', borderRadius: '16px', padding: '28px' }}>
          {/* Tab toggle */}
          <div style={{ display: 'flex', backgroundColor: '#0f0f0f', borderRadius: '10px', padding: '4px', marginBottom: '24px' }}>
            {(['SALARY', 'HOURLY'] as WageType[]).map(type => (
              <button
                key={type}
                type="button"
                onClick={() => setWageType(type)}
                style={{
                  flex: 1,
                  padding: '8px',
                  borderRadius: '7px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 600,
                  transition: 'all 0.15s',
                  backgroundColor: wageType === type ? '#1f1f1f' : 'transparent',
                  color: wageType === type ? '#f5f5f5' : '#737373',
                }}
              >
                {type === 'SALARY' ? 'Salaried' : 'Hourly'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            {wageType === 'SALARY' ? (
              <div style={fieldWrap}>
                <label style={label}>Annual Salary</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#737373', fontSize: '15px' }}>$</span>
                  <input
                    type="number"
                    value={annualSalary}
                    onChange={e => setAnnualSalary(e.target.value)}
                    placeholder="75,000"
                    required
                    min="0"
                    step="0.01"
                    style={{ ...input, paddingLeft: '24px' }}
                  />
                </div>
              </div>
            ) : (
              <>
                <div style={fieldWrap}>
                  <label style={label}>Hourly Rate</label>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#737373', fontSize: '15px' }}>$</span>
                    <input
                      type="number"
                      value={hourlyRate}
                      onChange={e => setHourlyRate(e.target.value)}
                      placeholder="25.00"
                      required
                      min="0"
                      step="0.01"
                      style={{ ...input, paddingLeft: '24px' }}
                    />
                  </div>
                </div>
                <div style={fieldWrap}>
                  <label style={label}>Weeks Per Year</label>
                  <input
                    type="number"
                    value={weeksPerYear}
                    onChange={e => setWeeksPerYear(e.target.value)}
                    placeholder="50"
                    required
                    min="1"
                    max="52"
                    style={input}
                  />
                </div>
              </>
            )}

            <div style={fieldWrap}>
              <label style={label}>Hours Per Week</label>
              <input
                type="number"
                value={hoursPerWeek}
                onChange={e => setHoursPerWeek(e.target.value)}
                placeholder="40"
                required
                min="1"
                max="168"
                style={input}
              />
            </div>

            {error && (
              <p style={{ color: '#f87171', fontSize: '13px', marginBottom: '12px' }}>{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '11px',
                backgroundColor: loading ? '#92400e' : '#f59e0b',
                color: '#000',
                fontWeight: 700,
                fontSize: '14px',
                borderRadius: '8px',
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'background-color 0.15s',
                marginTop: '8px',
              }}
            >
              {loading ? 'Saving...' : 'Save & Continue →'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
