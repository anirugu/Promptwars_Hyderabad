import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

const links = [
  { to: '/explore', label: 'Explore' },
  { to: '/recommendations', label: 'Recommendations' },
  { to: '/planner', label: 'Plan a Trip' },
  { to: '/trips', label: 'My Trips' }
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, authReady, signIn, signOut } = useAuth();
  const [busy, setBusy] = useState(false);

  const handleSignIn = async () => {
    if (busy) return;
    setBusy(true);
    try {
      await signIn();
    } catch (err) {
      console.error('Sign-in failed', err);
    } finally {
      setBusy(false);
    }
  };

  const handleSignOut = async () => {
    if (busy) return;
    setBusy(true);
    try {
      await signOut();
    } finally {
      setBusy(false);
    }
  };

  return (
    <header className="navbar">
      <div className="container navbar__inner">
        <Link to="/" className="navbar__brand" onClick={() => setOpen(false)}>
          <span className="navbar__logo" aria-hidden>
            🧭
          </span>
          <span>
            Wander<span className="navbar__brand-accent">Forge</span>
          </span>
        </Link>

        <button
          className="navbar__toggle"
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
        >
          <span /> <span /> <span />
        </button>

        <nav className={`navbar__links ${open ? 'is-open' : ''}`}>
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `navbar__link ${isActive ? 'is-active' : ''}`
              }
              onClick={() => setOpen(false)}
            >
              {l.label}
            </NavLink>
          ))}
          <Link to="/planner" className="btn btn--accent btn--small navbar__cta">
            Start planning
          </Link>

          {authReady && !user && (
            <button
              type="button"
              className="btn btn--ghost btn--small navbar__auth"
              onClick={handleSignIn}
              disabled={busy}
            >
              {busy ? 'Signing in…' : 'Sign in'}
            </button>
          )}

          {authReady && user && (
            <div className="navbar__user">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt=""
                  className="navbar__avatar"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <span className="navbar__avatar navbar__avatar--fallback" aria-hidden>
                  {(user.displayName || user.email || '?').charAt(0).toUpperCase()}
                </span>
              )}
              <button
                type="button"
                className="btn btn--ghost btn--small"
                onClick={handleSignOut}
                disabled={busy}
              >
                Sign out
              </button>
            </div>
          )}
        </nav>
      </div>
      <NavbarStyles />
    </header>
  );
}

function NavbarStyles() {
  return (
    <style>{`
      .navbar {
        position: sticky;
        top: 0;
        z-index: 50;
        background: rgba(251, 250, 246, 0.85);
        backdrop-filter: blur(14px);
        border-bottom: 1px solid var(--border);
      }
      .navbar__inner {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
        padding: 16px 0;
      }
      .navbar__brand {
        font-family: var(--font-display);
        font-weight: 800;
        font-size: 1.4rem;
        color: var(--slate-900);
        display: inline-flex;
        align-items: center;
        gap: 10px;
      }
      .navbar__brand:hover { color: var(--slate-900); }
      .navbar__logo {
        display: inline-grid;
        place-items: center;
        width: 38px;
        height: 38px;
        border-radius: 12px;
        background: linear-gradient(135deg, var(--teal-700), var(--orange-500));
        color: #fff;
        font-size: 1.2rem;
      }
      .navbar__brand-accent { color: var(--orange-500); }
      .navbar__links {
        display: flex;
        align-items: center;
        gap: 6px;
      }
      .navbar__link {
        font-size: 0.95rem;
        font-weight: 600;
        padding: 8px 14px;
        border-radius: 999px;
        color: var(--slate-700);
      }
      .navbar__link:hover { color: var(--slate-900); background: var(--slate-100); }
      .navbar__link.is-active { color: var(--teal-700); background: var(--teal-100); }
      .navbar__cta { margin-left: 8px; }

      .navbar__auth { margin-left: 4px; }
      .navbar__user {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        margin-left: 8px;
      }
      .navbar__avatar {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        object-fit: cover;
        border: 1px solid var(--border);
        background: var(--slate-100);
      }
      .navbar__avatar--fallback {
        display: inline-grid;
        place-items: center;
        font-weight: 700;
        color: var(--slate-700);
        font-size: 0.85rem;
      }

      .navbar__toggle {
        display: none;
        background: none;
        border: 0;
        flex-direction: column;
        gap: 4px;
        padding: 6px;
      }
      .navbar__toggle span {
        width: 22px;
        height: 2px;
        background: var(--slate-900);
        border-radius: 2px;
      }
      @media (max-width: 820px) {
        .navbar__toggle { display: inline-flex; }
        .navbar__links {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          flex-direction: column;
          align-items: stretch;
          background: var(--surface);
          border-bottom: 1px solid var(--border);
          padding: 14px 4vw 20px;
          gap: 4px;
          transform: translateY(-12px);
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.18s ease, transform 0.18s ease;
        }
        .navbar__links.is-open {
          transform: translateY(0);
          opacity: 1;
          pointer-events: all;
        }
        .navbar__cta { margin: 8px 0 0; align-self: flex-start; }
        .navbar__user { margin: 8px 0 0; }
      }
    `}</style>
  );
}
