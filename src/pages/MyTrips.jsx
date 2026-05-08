import { Link, useNavigate } from 'react-router-dom';
import { useTrip } from '../context/TripContext.jsx';
import { getDestination } from '../data/destinations.js';
import { getExperience } from '../data/experiences.js';
import EmptyState from '../components/EmptyState.jsx';

export default function MyTrips() {
  const { savedTrips, deleteTrip, loadTripIntoDraft } = useTrip();
  const navigate = useNavigate();

  if (savedTrips.length === 0) {
    return (
      <section className="section container">
        <span className="eyebrow">My trips</span>
        <h1>Your saved trips will live here</h1>
        <EmptyState
          icon="📒"
          title="No trips saved yet"
          message="Build a plan in the trip planner and hit save — it’ll show up here."
          action={
            <Link to="/planner" className="btn btn--primary">
              Start planning
            </Link>
          }
        />
      </section>
    );
  }

  const handleEdit = (id) => {
    loadTripIntoDraft(id);
    navigate(`/planner/${id}`);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this trip? This cannot be undone.')) {
      deleteTrip(id);
    }
  };

  return (
    <section className="section container">
      <div className="flex--between">
        <div>
          <span className="eyebrow">My trips</span>
          <h1 style={{ marginBottom: 4 }}>Saved itineraries</h1>
          <p className="muted">
            {savedTrips.length} trip{savedTrips.length === 1 ? '' : 's'} stored locally on this device.
          </p>
        </div>
        <Link to="/planner" className="btn btn--accent">
          + New trip
        </Link>
      </div>

      <div className="grid grid--2" style={{ marginTop: 24 }}>
        {savedTrips.map((trip) => {
          const destination = trip.destinationId ? getDestination(trip.destinationId) : null;
          const allIds = Object.values(trip.itinerary ?? {}).flat();
          const experiences = allIds.map(getExperience).filter(Boolean);
          const totalCost = experiences.reduce((s, e) => s + e.cost, 0);
          const lodging =
            destination && trip.days && trip.travellers
              ? destination.avgDailyBudget * trip.days * trip.travellers
              : 0;

          return (
            <article key={trip.id} className="trip-card">
              <div
                className="trip-card__hero"
                style={{
                  background: destination?.gradient ?? 'linear-gradient(135deg, #94a3b8, #1e293b)'
                }}
              >
                <span className="trip-card__emoji" aria-hidden>
                  {destination?.emoji ?? '🗺️'}
                </span>
                <span className="card__badge">
                  {trip.days} day{trip.days === 1 ? '' : 's'}
                </span>
              </div>
              <div className="trip-card__body">
                <h3 style={{ margin: '0 0 4px' }}>{trip.name || 'Untitled trip'}</h3>
                <p className="muted" style={{ margin: 0, fontSize: '0.9rem' }}>
                  {destination
                    ? `${destination.name}, ${destination.country}`
                    : 'No destination yet'}
                  {trip.startDate && ` · starts ${formatDate(trip.startDate)}`}
                </p>

                <div className="trip-card__stats">
                  <div>
                    <span>Experiences</span>
                    <strong>{experiences.length}</strong>
                  </div>
                  <div>
                    <span>Travellers</span>
                    <strong>{trip.travellers}</strong>
                  </div>
                  <div>
                    <span>Activities</span>
                    <strong>${totalCost.toLocaleString()}</strong>
                  </div>
                  <div>
                    <span>Est. total</span>
                    <strong>${(totalCost + lodging).toLocaleString()}</strong>
                  </div>
                </div>

                {trip.notes && (
                  <p className="trip-card__notes">📝 {trip.notes}</p>
                )}

                <div className="trip-card__actions">
                  <button
                    type="button"
                    className="btn btn--primary btn--small"
                    onClick={() => handleEdit(trip.id)}
                  >
                    Open / edit
                  </button>
                  <button
                    type="button"
                    className="btn btn--ghost btn--small"
                    onClick={() => handleDelete(trip.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <style>{`
        .trip-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          overflow: hidden;
          transition: transform 0.18s ease, box-shadow 0.18s ease;
        }
        .trip-card:hover { transform: translateY(-3px); box-shadow: var(--shadow-md); }
        .trip-card__hero {
          aspect-ratio: 8/3;
          display: grid;
          place-items: center;
          color: #fff;
          position: relative;
        }
        .trip-card__emoji {
          font-size: 3rem;
          filter: drop-shadow(0 6px 14px rgba(0,0,0,0.3));
        }
        .trip-card__body { padding: 18px 20px 20px; }
        .trip-card__stats {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 8px 16px;
          margin: 16px 0 12px;
          padding: 14px 0;
          border-top: 1px solid var(--border);
          border-bottom: 1px solid var(--border);
        }
        .trip-card__stats span {
          display: block;
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--slate-500);
        }
        .trip-card__stats strong {
          font-family: var(--font-display);
          font-size: 1rem;
          color: var(--slate-900);
        }
        .trip-card__notes {
          background: var(--surface-alt);
          padding: 8px 12px;
          border-radius: var(--radius-md);
          font-size: 0.85rem;
          color: var(--slate-700);
          margin: 0 0 14px;
        }
        .trip-card__actions {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        @media (max-width: 540px) {
          .trip-card__stats { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>
    </section>
  );
}

function formatDate(isoDate) {
  if (!isoDate) return '';
  try {
    const d = new Date(isoDate);
    return d.toLocaleDateString(undefined, {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  } catch {
    return isoDate;
  }
}
