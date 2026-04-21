import { Routes, Route, NavLink, Link, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import { useIsMobile } from './hooks/useWindowWidth';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import SetupPage from './pages/SetupPage';
import ExpensesPage from './pages/ExpensesPage';
import AuditPage from './pages/AuditPage';
import WhatIfPage from './pages/WhatIfPage';
import AdminPage from './pages/AdminPage';
import AboutPage from './pages/AboutPage';

const MEMBER_NAV = [
  { to: '/setup',    label: 'Setup'    },
  { to: '/expenses', label: 'Expenses' },
  { to: '/audit',    label: 'Audit'    },
  { to: '/whatif',   label: 'What If'  },
  { to: '/about',    label: 'About'    },
];

const ADMIN_NAV = [
  ...MEMBER_NAV.slice(0, -1),
  { to: '/admin', label: 'Admin' },
  { to: '/about', label: 'About' },
];

function AppShell() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const isMobile = useIsMobile();

  // Login and register have no nav at all
  const isNoNav = ['/login', '/register'].includes(location.pathname);

  const navLinks = user?.role === 'ADMIN' ? ADMIN_NAV : MEMBER_NAV;

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#0f0f0f',
      color: '#f5f5f5',
    }}>

      {/* ── Top bar ── */}
      {!isNoNav && (
        <nav style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 16px',
          height: '52px',
          borderBottom: '1px solid #1a1a1a',
          position: 'sticky',
          top: 0,
          backgroundColor: '#0f0f0f',
          zIndex: 10,
        }}>
          <span style={{ color: '#f59e0b', fontWeight: 700, fontSize: '18px', letterSpacing: '-0.02em' }}>
            Spent
          </span>

          {/* Desktop nav links — only shown when logged in */}
          {user && !isMobile && (
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
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {user ? (
              <>
                {user.name && !isMobile && (
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
                  }}
                >
                  Sign out
                </button>
              </>
            ) : (
              <Link
                to="/login"
                style={{
                  padding: '5px 12px',
                  backgroundColor: 'transparent',
                  border: '1px solid #2d2d2d',
                  borderRadius: '6px',
                  color: '#737373',
                  fontSize: '13px',
                  textDecoration: 'none',
                }}
              >
                Sign in
              </Link>
            )}
          </div>
        </nav>
      )}

      {/* ── Page content ── */}
      <main style={{
        flex: 1,
        paddingBottom: (!isNoNav && user && isMobile) ? '64px' : undefined,
      }}>
        <Routes>
          <Route path="/login"    element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/about"    element={<AboutPage />} />
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

      {/* ── Mobile bottom nav — only when logged in ── */}
      {!isNoNav && user && isMobile && (
        <nav style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          height: '60px',
          backgroundColor: '#0f0f0f',
          borderTop: '1px solid #1a1a1a',
          display: 'flex',
          zIndex: 20,
        }}>
          {navLinks.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              style={({ isActive }) => ({
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textDecoration: 'none',
                fontSize: '11px',
                fontWeight: 600,
                letterSpacing: '0.02em',
                color: isActive ? '#f59e0b' : '#525252',
                borderTop: isActive ? '2px solid #f59e0b' : '2px solid transparent',
                transition: 'color 0.15s',
              })}
            >
              {label}
            </NavLink>
          ))}
        </nav>
      )}
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
