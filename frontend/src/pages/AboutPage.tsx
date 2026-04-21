const STACK: { category: string; items: { name: string; detail: string }[] }[] = [
  {
    category: 'Backend',
    items: [
      { name: 'Java 25 + Spring Boot 4', detail: 'REST API, dependency injection, lifecycle management' },
      { name: 'Spring Security', detail: 'Session-based auth, BCrypt hashing, role-based access control' },
      { name: 'Spring Data JPA / Hibernate', detail: 'ORM, schema migrations via ddl-auto, custom repository queries' },
      { name: 'PostgreSQL', detail: 'Production database with user/expense relational schema' },
      { name: 'H2', detail: 'In-memory database for local development — zero config' },
    ],
  },
  {
    category: 'Frontend',
    items: [
      { name: 'React 18 + TypeScript', detail: 'Component architecture, hooks, context API for auth state' },
      { name: 'Vite', detail: 'Fast HMR in development, optimized production bundles' },
      { name: 'React Router', detail: 'Client-side SPA routing with protected route guards' },
      { name: 'Axios', detail: 'HTTP client with credential handling for session cookies' },
    ],
  },
  {
    category: 'Infrastructure',
    items: [
      { name: 'Raspberry Pi 3 (ARM64)', detail: 'Self-hosted server running Raspberry Pi OS Lite' },
      { name: 'Nginx', detail: 'Reverse proxy for the Spring Boot API, static file server for the React SPA' },
      { name: 'Cloudflare Tunnel', detail: 'Public HTTPS exposure without port forwarding or a static IP' },
      { name: 'systemd', detail: 'Service management — auto-restart on crash, boot persistence' },
    ],
  },
  {
    category: 'CI / CD',
    items: [
      { name: 'GitHub Actions', detail: 'Automated pipeline triggered on every merge to main' },
      { name: 'Self-hosted Runner (ARM64)', detail: 'Runner installed on the Pi — no SSH exposure required' },
      { name: 'Maven + npm', detail: 'Backend JAR build and frontend asset compilation in-pipeline' },
    ],
  },
  {
    category: 'AI Integration',
    items: [
      { name: 'Anthropic Claude API', detail: 'Generates a personalized plain-English audit narrative from the user\'s financial data' },
    ],
  },
];

const FEATURES = [
  { title: 'Hours-based framing', desc: 'Every expense is converted into hours of work at your true net hourly rate — not just dollars.' },
  { title: 'Workday visualizer', desc: 'A segmented bar shows how many hours of an 8-hour workday go to each expense category before you keep a cent.' },
  { title: 'Year-in-weeks grid', desc: 'A 52-week grid shows which weeks of your year are already spoken for by your fixed expenses.' },
  { title: 'AI audit narrative', desc: 'Claude reads your financial profile and writes a candid, personalized summary of what your numbers actually mean.' },
  { title: '"What if" modeling', desc: 'Adjust income or remove expenses to see how your metrics shift in real time.' },
  { title: 'Admin approval workflow', desc: 'Role-based access control — new accounts are pending until an admin approves them.' },
  { title: 'Fully self-hosted', desc: 'Runs on a $35 Raspberry Pi behind a Cloudflare Tunnel. No cloud bill, no vendor lock-in.' },
  { title: 'Automated deploys', desc: 'Merging a PR to main triggers a GitHub Actions pipeline that builds and deploys to the Pi without any manual steps.' },
];

export default function AboutPage() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '36px 16px 60px' }}>

      {/* Hero */}
      <div style={{ marginBottom: '48px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '12px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 700, letterSpacing: '-0.03em', color: '#f5f5f5' }}>Spent</h1>
          <span style={{ fontSize: '14px', color: '#525252' }}>Full-stack personal finance app</span>
        </div>
        <p style={{ fontSize: '17px', lineHeight: '1.7', color: '#a3a3a3', maxWidth: '620px' }}>
          A self-hosted web application that reframes personal finance by converting every expense into hours of work.
          Instead of asking <em style={{ color: '#d4d4d4' }}>"how much does rent cost?"</em>, Spent asks{' '}
          <em style={{ color: '#f59e0b' }}>"how many hours of your life does rent cost?"</em>
        </p>
        <div style={{ marginTop: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {['Java', 'Spring Boot', 'React', 'TypeScript', 'PostgreSQL', 'Raspberry Pi', 'GitHub Actions'].map(tag => (
            <span key={tag} style={{
              fontSize: '12px',
              fontWeight: 600,
              padding: '4px 10px',
              borderRadius: '20px',
              backgroundColor: '#1a1a1a',
              border: '1px solid #2d2d2d',
              color: '#a3a3a3',
            }}>
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* What it does */}
      <Section title="What it does">
        <p style={{ fontSize: '15px', lineHeight: '1.75', color: '#a3a3a3', marginBottom: '20px' }}>
          Users enter their income (salary or hourly rate) and their recurring monthly expenses. Spent calculates
          a <strong style={{ color: '#f5f5f5' }}>true hourly rate</strong> — net income divided by hours actually
          worked — then expresses every expense in those hours. The result is a set of visualizations that make
          the real cost of your lifestyle visceral rather than abstract.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px' }}>
          {FEATURES.map(f => (
            <div key={f.title} style={{
              backgroundColor: '#141414',
              border: '1px solid #242424',
              borderRadius: '12px',
              padding: '16px',
            }}>
              <p style={{ fontSize: '13px', fontWeight: 700, color: '#f5f5f5', marginBottom: '6px' }}>{f.title}</p>
              <p style={{ fontSize: '13px', lineHeight: '1.6', color: '#737373' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Tech stack */}
      <Section title="Tech stack">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {STACK.map(group => (
            <div key={group.category}>
              <p style={{ fontSize: '11px', fontWeight: 700, color: '#525252', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '10px' }}>
                {group.category}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {group.items.map(item => (
                  <div key={item.name} style={{
                    display: 'flex',
                    gap: '12px',
                    alignItems: 'baseline',
                    padding: '10px 14px',
                    backgroundColor: '#141414',
                    border: '1px solid #1f1f1f',
                    borderRadius: '8px',
                  }}>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#f5f5f5', whiteSpace: 'nowrap', minWidth: '200px', flexShrink: 0 }}>
                      {item.name}
                    </span>
                    <span style={{ fontSize: '13px', color: '#737373', lineHeight: '1.5' }}>{item.detail}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Architecture */}
      <Section title="Architecture">
        <p style={{ fontSize: '15px', lineHeight: '1.75', color: '#a3a3a3', marginBottom: '16px' }}>
          The entire application runs on a single Raspberry Pi 3 at home. Nginx serves the compiled React
          bundle as static files and proxies <code style={codeStyle}>/api/*</code> requests to Spring Boot on port 8080.
          A Cloudflare Tunnel creates an outbound connection from the Pi to Cloudflare's edge, terminating
          HTTPS there — no port forwarding, no static IP, no certificate management required.
        </p>
        <div style={{ backgroundColor: '#0d0d0d', border: '1px solid #1f1f1f', borderRadius: '12px', padding: '20px', fontFamily: 'monospace', fontSize: '13px', color: '#737373', lineHeight: '2' }}>
          <span style={{ color: '#f59e0b' }}>Browser</span>
          {' → '}
          <span style={{ color: '#3b82f6' }}>Cloudflare Edge (HTTPS)</span>
          {' → '}
          <span style={{ color: '#8b5cf6' }}>Cloudflare Tunnel</span>
          {' → '}
          <span style={{ color: '#22c55e' }}>Raspberry Pi</span>
          <br />
          <span style={{ color: '#525252', marginLeft: '60%' }}>↓</span>
          <br />
          <span style={{ color: '#525252', marginLeft: '45%' }}>Nginx :80</span>
          <br />
          <span style={{ color: '#525252', marginLeft: '43%' }}>↙{'    '}↘</span>
          <br />
          <span style={{ color: '#525252', marginLeft: '28%' }}>React (static)</span>
          <span style={{ color: '#525252' }}>{'   '}Spring Boot :8080</span>
          <br />
          <span style={{ color: '#525252', marginLeft: '65%' }}>↓</span>
          <br />
          <span style={{ color: '#525252', marginLeft: '61%' }}>PostgreSQL</span>
        </div>
      </Section>

      {/* Skills */}
      <Section title="Skills demonstrated">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '10px' }}>
          {[
            'Full-stack web development',
            'REST API design',
            'Relational database modeling',
            'Authentication & authorization',
            'Spring Security (session + roles)',
            'React hooks & context',
            'TypeScript',
            'Responsive UI design',
            'Linux server administration',
            'Nginx configuration',
            'systemd service management',
            'DNS & network configuration',
            'CI/CD pipeline design',
            'GitHub Actions',
            'Self-hosted infrastructure',
            'LLM API integration',
          ].map(skill => (
            <div key={skill} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 12px',
              backgroundColor: '#141414',
              border: '1px solid #1f1f1f',
              borderRadius: '8px',
              fontSize: '13px',
              color: '#a3a3a3',
            }}>
              <span style={{ color: '#f59e0b', fontSize: '10px' }}>▸</span>
              {skill}
            </div>
          ))}
        </div>
      </Section>

      {/* Footer note */}
      <div style={{ marginTop: '40px', padding: '20px', backgroundColor: '#111', border: '1px solid #1f1f1f', borderRadius: '12px', textAlign: 'center' }}>
        <p style={{ fontSize: '13px', color: '#525252', lineHeight: '1.7' }}>
          Built end-to-end by Jordan Posthauer — from database schema to CI/CD pipeline to DNS configuration.
          <br />
          <a href="https://github.com/jposthau/spent" target="_blank" rel="noreferrer" style={{ color: '#f59e0b', textDecoration: 'none', marginTop: '8px', display: 'inline-block' }}>
            github.com/jposthau/spent ↗
          </a>
        </p>
      </div>

    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '44px' }}>
      <h2 style={{
        fontSize: '13px',
        fontWeight: 700,
        color: '#525252',
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        marginBottom: '20px',
        paddingBottom: '10px',
        borderBottom: '1px solid #1a1a1a',
      }}>
        {title}
      </h2>
      {children}
    </div>
  );
}

const codeStyle: React.CSSProperties = {
  fontFamily: 'monospace',
  fontSize: '13px',
  backgroundColor: '#1a1a1a',
  padding: '1px 6px',
  borderRadius: '4px',
  color: '#d4d4d4',
};
