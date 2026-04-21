import { useState } from 'react';
import { Link } from 'react-router-dom';
import { register } from '../api/auth';

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

export default function RegisterPage() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm]   = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const [success, setSuccess]   = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) { setError('Passwords do not match.'); return; }
    if (password.length < 6)  { setError('Password must be at least 6 characters.'); return; }
    setLoading(true);
    setError('');
    try {
      await register(email, password);
      setSuccess(true);
    } catch (err: any) {
      const msg = err?.response?.data?.message;
      setError(msg ?? 'Something went wrong. Please try again.');
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

          {success ? (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '32px', marginBottom: '16px' }}>✓</div>
              <p style={{ color: '#f5f5f5', fontWeight: 600, fontSize: '16px', marginBottom: '8px' }}>
                Request submitted
              </p>
              <p style={{ color: '#737373', fontSize: '14px', lineHeight: 1.6, marginBottom: '24px' }}>
                Your account is pending approval. You'll be able to sign in once an admin reviews your request.
              </p>
              <Link
                to="/login"
                style={{ color: '#f59e0b', fontSize: '14px', textDecoration: 'none' }}
              >
                Back to sign in
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <p style={{ color: '#f5f5f5', fontWeight: 600, fontSize: '16px', marginBottom: '20px', textAlign: 'left' }}>
                Create account
              </p>

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

              <div style={{ marginBottom: '12px', textAlign: 'left' }}>
                <label style={{ display: 'block', fontSize: '12px', color: '#737373', fontWeight: 500, marginBottom: '6px' }}>
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  required
                  autoComplete="new-password"
                  style={inputStyle}
                />
              </div>

              <div style={{ marginBottom: '20px', textAlign: 'left' }}>
                <label style={{ display: 'block', fontSize: '12px', color: '#737373', fontWeight: 500, marginBottom: '6px' }}>
                  Confirm password
                </label>
                <input
                  type="password"
                  value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete="new-password"
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
                {loading ? '...' : 'Request access'}
              </button>

              <p style={{ fontSize: '13px', color: '#525252' }}>
                Already have an account?{' '}
                <Link to="/login" style={{ color: '#f59e0b', textDecoration: 'none' }}>
                  Sign in
                </Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
