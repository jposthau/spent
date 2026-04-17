import { Routes, Route, NavLink } from 'react-router-dom';
import SetupPage from './pages/SetupPage';
import ExpensesPage from './pages/ExpensesPage';
import AuditPage from './pages/AuditPage';
import WhatIfPage from './pages/WhatIfPage';

function App() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#0f0f0f', color: '#f5f5f5' }}>
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', height: '56px', borderBottom: '1px solid #262626', position: 'sticky', top: 0, backgroundColor: '#0f0f0f', zIndex: 10 }}>
        <span style={{ color: '#f59e0b', fontWeight: 700, fontSize: '18px', letterSpacing: '-0.02em' }}>Spent</span>
        <div style={{ display: 'flex', gap: '4px' }}>
          {[
            { to: '/', label: 'Setup' },
            { to: '/expenses', label: 'Expenses' },
            { to: '/audit', label: 'Audit' },
            { to: '/whatif', label: 'What If' },
          ].map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
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
      </nav>
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<SetupPage />} />
          <Route path="/expenses" element={<ExpensesPage />} />
          <Route path="/audit" element={<AuditPage />} />
          <Route path="/whatif" element={<WhatIfPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
