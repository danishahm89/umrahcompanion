import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

const NAV = [
  { to: '/packages', label: 'Packages' },
  { to: '/guide-rituals', label: 'Guide rituals' },
  { to: '/guide-steps', label: 'First-time steps' },
  { to: '/duas', label: 'Duas' },
  { to: '/packing', label: 'Packing checklist' },
  { to: '/vaccines', label: 'Vaccines' },
  { to: '/news', label: 'News' },
  { to: '/nusuk-links', label: 'Nusuk links' },
  { to: '/faq', label: 'FAQ' },
  { to: '/services', label: 'Services' },
  { to: '/ebooks', label: 'Ebooks' },
  { to: '/contact', label: 'Contact & settings' },
  { to: '/enquiries', label: 'Enquiries' },
];

export function Layout() {
  const { user, logout } = useAuth();

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <aside style={{ width: 220, flex: 'none', borderRight: '2px solid var(--color-divider-strong)', padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <div style={{ fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-accent)' }}>Alzakwaan</div>
          <h2 style={{ fontSize: 18, marginTop: 6 }}>Umrah Companion</h2>
        </div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {NAV.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              style={({ isActive }) => ({
                padding: '8px 10px',
                textDecoration: 'none',
                color: isActive ? 'var(--color-bg)' : 'var(--color-text)',
                background: isActive ? 'var(--color-accent)' : 'transparent',
                fontSize: 13,
                fontWeight: 600,
              })}
            >
              {n.label}
            </NavLink>
          ))}
        </nav>
        <div style={{ marginTop: 'auto', fontSize: 12, color: 'var(--t70)' }}>
          <div>{user?.name}</div>
          <div>{user?.email}</div>
          <button className="secondary" style={{ marginTop: 10, width: '100%' }} onClick={logout}>Log out</button>
        </div>
      </aside>
      <main style={{ flex: 1, padding: 28, overflowX: 'auto' }}>
        <Outlet />
      </main>
    </div>
  );
}
