import { Routes, Route, NavLink, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import SetupPage from './pages/SetupPage';
import ExpensesPage from './pages/ExpensesPage';
import AuditPage from './pages/AuditPage';
import WhatIfPage from './pages/WhatIfPage';
import AdminPage from './pages/AdminPage';

const MEMBER_NAV = [
  { to: '/setup',    label: 'Setup'    },
  { to: '/expenses', label: 'Expenses' },
  { to: '/audit',    label: 'Audit'    },
  { to: '/whatif',   label: 'What If'  },
];

function AppShell() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const isPublic = ['/login', '/register'].includes(location.pathname);

  const navLinks = user?.role === 'ADMIN'
    ? [...MEMBER_NAV, { to: '/admin', label: 'Admin' }]
    : MEMBER_NAV;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#0f0f0f', color: '#f5f5f5' }}>

      {!isPublic && (
        <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', height: '56px', borderBottom: '1px solid #262626', position: 'sticky', top: 0, backgroundColor: '#0f0f0f', zIndex: 10 }}>
          <span style={{ color: '#f59e0b', fontWeight: 700, fontSize: '18px', letterSpacing: '-0.02em' }}>Spent</span>

          <div style={{ display: 'flex', gap: '4px' }}>
            {navLinks.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                style={({ isActive }) => ({
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: 500,
                  textDecoration: 'none',
                  color: isActive ? '#f5f5f5' : '#737373',
                  backgroundColor: isActive ? '#1f1f1f' : 'transparent',
                  transition: 'color 0.15s, background-color 0.15s',
                })}
              >
                {label}
              </NavLink>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {user?.name && (
              <span style={{ fontSize: '13px', color: '#525252' }}>{user.name}</span>
            )}
            <button
              onClick={logout}
              style={{
                padding: '5px 12px',
                backgroundColor: 'transparent',
                border: '1px solid #2d2d2d',
                borderRadius: '6px',
                color: '#737373',
                fontSize: '13px',
                cursor: 'pointer',
                transition: 'color 0.15s, border-color 0.15s',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.color = '#f5f5f5';
                (e.currentTarget as HTMLButtonElement).style.borderColor = '#404040';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.color = '#737373';
                (e.currentTarget as HTMLButtonElement).style.borderColor = '#2d2d2d';
              }}
            >
              Sign out
            </button>
          </div>
        </nav>
      )}

      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/login"    element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/setup" element={
            <ProtectedRoute requireSetup={true}>
              <SetupPage />
            </ProtectedRoute>
          } />
          <Route path="/expenses" element={
            <ProtectedRoute>
              <ExpensesPage />
            </ProtectedRoute>
          } />
          <Route path="/audit" element={
            <ProtectedRoute>
              <AuditPage />
            </ProtectedRoute>
          } />
          <Route path="/whatif" element={
            <ProtectedRoute>
              <WhatIfPage />
            </ProtectedRoute>
          } />
          <Route path="/admin" element={
            <ProtectedRoute requireAdmin={true}>
              <AdminPage />
            </ProtectedRoute>
          } />
          <Route path="/" element={
            <ProtectedRoute>
              <AuditPage />
            </ProtectedRoute>
          } />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppShell />
    </AuthProvider>
  );
}

export default App;
