import { useEffect, useState } from 'react';
import { listUsers, approveUser, denyUser, type AdminUser } from '../api/admin';

const STATUS_COLORS: Record<string, string> = {
  PENDING:  '#f59e0b',
  APPROVED: '#22c55e',
  DENIED:   '#ef4444',
};

function StatusBadge({ status }: { status: string }) {
  return (
    <span style={{
      fontSize: '11px',
      fontWeight: 600,
      padding: '2px 8px',
      borderRadius: '20px',
      backgroundColor: STATUS_COLORS[status] + '22',
      color: STATUS_COLORS[status] ?? '#737373',
      border: `1px solid ${STATUS_COLORS[status] ?? '#737373'}44`,
    }}>
      {status}
    </span>
  );
}

export default function AdminPage() {
  const [users, setUsers]   = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState('');
  const [working, setWorking] = useState<number | null>(null);

  const load = () => {
    setLoading(true);
    listUsers()
      .then(setUsers)
      .catch(() => setError('Failed to load users.'))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handle = async (id: number, action: 'approve' | 'deny') => {
    setWorking(id);
    try {
      const updated = action === 'approve' ? await approveUser(id) : await denyUser(id);
      setUsers(prev => prev.map(u => u.id === id ? updated : u));
    } catch {
      setError('Action failed. Please try again.');
    } finally {
      setWorking(null);
    }
  };

  const pending  = users.filter(u => u.status === 'PENDING'  && u.role !== 'ADMIN');
  const approved = users.filter(u => u.status === 'APPROVED' && u.role !== 'ADMIN');
  const denied   = users.filter(u => u.status === 'DENIED'   && u.role !== 'ADMIN');

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '300px', color: '#737373', fontSize: '14px' }}>
        Loading…
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '36px 16px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '4px' }}>Admin</h1>
        <p style={{ color: '#737373', fontSize: '14px' }}>Manage user access requests.</p>
      </div>

      {error && (
        <p style={{ color: '#f87171', fontSize: '13px', marginBottom: '16px' }}>{error}</p>
      )}

      {/* Pending requests */}
      <Section title="Pending requests" count={pending.length}>
        {pending.length === 0 ? (
          <Empty text="No pending requests." />
        ) : pending.map(u => (
          <UserRow key={u.id} user={u} working={working === u.id}>
            <ActionButton onClick={() => handle(u.id, 'approve')} disabled={working !== null} variant="approve">
              Approve
            </ActionButton>
            <ActionButton onClick={() => handle(u.id, 'deny')} disabled={working !== null} variant="deny">
              Deny
            </ActionButton>
          </UserRow>
        ))}
      </Section>

      {/* Approved */}
      <Section title="Approved" count={approved.length}>
        {approved.length === 0 ? (
          <Empty text="No approved users." />
        ) : approved.map(u => (
          <UserRow key={u.id} user={u} working={working === u.id}>
            <ActionButton onClick={() => handle(u.id, 'deny')} disabled={working !== null} variant="deny">
              Revoke
            </ActionButton>
          </UserRow>
        ))}
      </Section>

      {/* Denied */}
      <Section title="Denied" count={denied.length}>
        {denied.length === 0 ? (
          <Empty text="No denied users." />
        ) : denied.map(u => (
          <UserRow key={u.id} user={u} working={working === u.id}>
            <ActionButton onClick={() => handle(u.id, 'approve')} disabled={working !== null} variant="approve">
              Approve
            </ActionButton>
          </UserRow>
        ))}
      </Section>
    </div>
  );
}

function Section({ title, count, children }: { title: string; count: number; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '28px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
        <p style={{ fontSize: '13px', fontWeight: 600, color: '#a3a3a3', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          {title}
        </p>
        <span style={{ fontSize: '12px', color: '#525252', backgroundColor: '#1a1a1a', padding: '1px 8px', borderRadius: '20px', border: '1px solid #2d2d2d' }}>
          {count}
        </span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {children}
      </div>
    </div>
  );
}

function UserRow({ user, working, children }: { user: AdminUser; working: boolean; children: React.ReactNode }) {
  return (
    <div style={{
      backgroundColor: '#141414',
      border: '1px solid #242424',
      borderRadius: '12px',
      padding: '14px 16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '12px',
      opacity: working ? 0.6 : 1,
    }}>
      <div style={{ minWidth: 0 }}>
        <p style={{ fontSize: '14px', color: '#f5f5f5', fontWeight: 500, marginBottom: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {user.email}
        </p>
        {user.name && (
          <p style={{ fontSize: '12px', color: '#525252' }}>{user.name}</p>
        )}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
        <StatusBadge status={user.status} />
        {children}
      </div>
    </div>
  );
}

function ActionButton({
  onClick, disabled, variant, children
}: {
  onClick: () => void;
  disabled: boolean;
  variant: 'approve' | 'deny';
  children: React.ReactNode;
}) {
  const isApprove = variant === 'approve';
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: '5px 12px',
        fontSize: '12px',
        fontWeight: 600,
        borderRadius: '6px',
        border: 'none',
        cursor: disabled ? 'not-allowed' : 'pointer',
        backgroundColor: isApprove ? '#166534' : '#7f1d1d',
        color: isApprove ? '#4ade80' : '#f87171',
        transition: 'opacity 0.15s',
        opacity: disabled ? 0.5 : 1,
      }}
    >
      {children}
    </button>
  );
}

function Empty({ text }: { text: string }) {
  return (
    <p style={{ fontSize: '13px', color: '#525252', padding: '12px 0' }}>{text}</p>
  );
}
