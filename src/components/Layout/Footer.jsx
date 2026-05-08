import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__brand">
          <span className="footer__logo" aria-hidden>
            🧭
          </span>
          <div>
            <strong>WanderForge</strong>
            <p>Plan trips, discover experiences, travel better.</p>
          </div>
        </div>
        <div className="footer__cols">
          <div>
            <h4>Discover</h4>
            <Link to="/explore">All destinations</Link>
            <Link to="/recommendations">Personalised picks</Link>
          </div>
          <div>
            <h4>Plan</h4>
            <Link to="/planner">New trip</Link>
            <Link to="/trips">Saved trips</Link>
          </div>
          <div>
            <h4>About</h4>
            <a href="#" onClick={(e) => e.preventDefault()}>How it works</a>
            <a href="#" onClick={(e) => e.preventDefault()}>Privacy</a>
          </div>
        </div>
      </div>
      <div className="footer__bottom container">
        <span>© {new Date().getFullYear()} WanderForge — built with React.</span>
        <span>Made for explorers ✈️</span>
      </div>
      <style>{`
        .footer {
          margin-top: 64px;
          background: var(--slate-900);
          color: #fff;
        }
        .footer__inner {
          display: grid;
          grid-template-columns: 1fr 2fr;
          gap: 48px;
          padding: 56px 0 24px;
        }
        .footer__brand {
          display: flex;
          gap: 14px;
          align-items: flex-start;
        }
        .footer__brand strong {
          font-family: var(--font-display);
          font-size: 1.4rem;
          display: block;
          margin-bottom: 6px;
        }
        .footer__brand p { color: #cbd5e1; max-width: 280px; }
        .footer__logo {
          display: inline-grid;
          place-items: center;
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: linear-gradient(135deg, var(--teal-500), var(--orange-500));
          font-size: 1.4rem;
        }
        .footer__cols {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 24px;
        }
        .footer__cols h4 {
          color: #fff;
          font-family: var(--font-sans);
          font-size: 0.78rem;
          text-transform: uppercase;
          letter-spacing: 0.18em;
          margin-bottom: 12px;
          opacity: 0.65;
        }
        .footer__cols a {
          display: block;
          color: #e2e8f0;
          font-size: 0.95rem;
          padding: 4px 0;
        }
        .footer__cols a:hover { color: var(--teal-300); }
        .footer__bottom {
          padding: 18px 0;
          border-top: 1px solid rgba(255,255,255,0.1);
          display: flex;
          justify-content: space-between;
          font-size: 0.85rem;
          color: #94a3b8;
          flex-wrap: wrap;
          gap: 8px;
        }
        @media (max-width: 720px) {
          .footer__inner { grid-template-columns: 1fr; gap: 32px; }
        }
      `}</style>
    </footer>
  );
}
