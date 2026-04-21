import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../api/auth';
import { useAuth } from '../context/AuthContext';

const inputStyle: React.CSSProperties = {
  width: '100%',
  backgroundColor: '#1a1a1a',
  border: '1px solid #2d2d2d',
  borderRadius: '8px',
  padding: '10px 12px',
  color: '#f5f5f5',
  fontSize: '14px',
  outline: 'none',
  boxSizing: 'border-box',
};

export default function LoginPage() {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();

  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const user = await login(email, password);
      await refreshUser();
      navigate(user.isSetup ? '/audit' : '/setup');
    } catch (err: any) {
      const msg = err?.response?.data?.message;
      if (msg === 'pending') {
        setError('Your account is pending approval. Check back soon.');
      } else if (msg === 'denied') {
        setError('Your account request was denied.');
      } else {
        setError('Invalid email or password.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#0f0f0f',
      padding: '24px',
    }}>
      <div style={{ width: '100%', maxWidth: '380px', textAlign: 'center' }}>

        <div style={{ marginBottom: '40px' }}>
          <span style={{ color: '#f59e0b', fontWeight: 700, fontSize: '32px', letterSpacing: '-0.04em' }}>
            Spent
          </span>
          <p style={{ color: '#737373', fontSize: '14px', marginTop: '8px' }}>
            See your life in hours, not dollars.
          </p>
        </div>

        <div style={{
          backgroundColor: '#141414',
          border: '1px solid #242424',
          borderRadius: '16px',
          padding: '32px 28px',
        }}>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '12px', textAlign: 'left' }}>
              <label style={{ display: 'block', fontSize: '12px', color: '#737373', fontWeight: 500, marginBottom: '6px' }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                autoComplete="email"
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: '20px', textAlign: 'left' }}>
              <label style={{ display: 'block', fontSize: '12px', color: '#737373', fontWeight: 500, marginBottom: '6px' }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
                style={inputStyle}
              />
            </div>

            {error && (
              <p style={{ color: '#f87171', fontSize: '13px', marginBottom: '12px', textAlign: 'left' }}>{error}</p>
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
                marginBottom: '16px',
              }}
            >
              {loading ? '...' : 'Sign in'}
            </button>

            <p style={{ fontSize: '13px', color: '#525252' }}>
              Don't have an account?{' '}
              <Link to="/register" style={{ color: '#f59e0b', textDecoration: 'none' }}>
                Request access
              </Link>
            </p>
            <p style={{ fontSize: '12px', color: '#3a3a3a', marginTop: '12px' }}>
              <Link to="/about" style={{ color: '#3a3a3a', textDecoration: 'none' }}>
                About this project ↗
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
