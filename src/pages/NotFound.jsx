import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <section className="section container text-center">
      <div style={{ fontSize: '5rem', marginBottom: 12 }}>🧭</div>
      <h1>You’ve wandered off the map.</h1>
      <p className="muted" style={{ maxWidth: 480, margin: '0 auto 24px' }}>
        The page you’re looking for doesn’t exist. Let’s point you somewhere
        more interesting.
      </p>
      <div style={{ display: 'inline-flex', gap: 12, flexWrap: 'wrap' }}>
        <Link to="/" className="btn btn--primary">Back home</Link>
        <Link to="/explore" className="btn btn--ghost">Explore destinations</Link>
      </div>
    </section>
  );
}
