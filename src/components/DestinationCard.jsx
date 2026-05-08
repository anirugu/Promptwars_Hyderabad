import { Link } from 'react-router-dom';

export default function DestinationCard({ destination }) {
  if (!destination) return null;
  return (
    <Link to={`/destinations/${destination.id}`} className="card destination-card">
      <div
        className="card__media"
        style={{ background: destination.gradient }}
        aria-hidden
      >
        <span className="destination-card__emoji">{destination.emoji}</span>
        <span className="card__badge">{destination.region}</span>
      </div>
      <div className="card__body">
        <h3 className="card__title">{destination.name}</h3>
        <p className="muted" style={{ margin: 0 }}>
          {destination.country}
        </p>
        <p style={{ margin: '6px 0 0', fontSize: '0.92rem' }}>
          {destination.tagline}
        </p>
        <div className="card__meta">
          <span>📅 {destination.bestSeason}</span>
          <span>💵 ~${destination.avgDailyBudget}/day</span>
        </div>
      </div>
      <style>{`
        .destination-card { color: inherit; }
        .destination-card:hover { color: inherit; }
        .destination-card__emoji {
          font-size: 4.6rem;
          filter: drop-shadow(0 6px 12px rgba(0,0,0,0.25));
        }
      `}</style>
    </Link>
  );
}
