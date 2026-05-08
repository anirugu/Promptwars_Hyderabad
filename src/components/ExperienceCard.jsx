import { getInterest } from '../data/interests.js';
import { getDestination } from '../data/destinations.js';

/**
 * Versatile experience card.
 * Props:
 *  - experience: required
 *  - showDestination: render the destination name (for cross-destination lists)
 *  - actions: array of { label, onClick, variant ('primary'|'ghost'|'accent') }
 *  - dense: compact layout for itinerary lists
 *  - matchScore: optional integer to render relevance badge
 */
export default function ExperienceCard({
  experience,
  showDestination = false,
  actions = [],
  dense = false,
  matchScore
}) {
  if (!experience) return null;

  const category = getInterest(experience.category);
  const destination = showDestination
    ? getDestination(experience.destinationId)
    : null;

  return (
    <article className={`exp-card ${dense ? 'is-dense' : ''}`}>
      <div className="exp-card__icon" aria-hidden>
        {experience.emoji}
      </div>
      <div className="exp-card__body">
        <div className="exp-card__head">
          <h4 className="exp-card__title">{experience.title}</h4>
          {matchScore != null && matchScore > 0 && (
            <span className="chip chip--accent">
              ★ {matchScore} match
            </span>
          )}
        </div>

        {!dense && (
          <p className="exp-card__desc">{experience.description}</p>
        )}

        <div className="exp-card__meta">
          {category && (
            <span className="chip chip--teal">
              {category.emoji} {category.label}
            </span>
          )}
          <span>⏱ {formatDuration(experience.duration)}</span>
          <span>💵 {experience.cost === 0 ? 'Free' : `$${experience.cost}`}</span>
          <span>★ {experience.rating}</span>
          {destination && (
            <span className="muted">📍 {destination.name}</span>
          )}
        </div>

        {actions.length > 0 && (
          <div className="exp-card__actions">
            {actions.map((a, i) => (
              <button
                key={i}
                type="button"
                className={`btn btn--small btn--${a.variant ?? 'ghost'}`}
                onClick={a.onClick}
                disabled={a.disabled}
              >
                {a.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <style>{`
        .exp-card {
          display: flex;
          gap: 16px;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: 16px 18px;
          transition: border-color 0.18s ease, box-shadow 0.18s ease, transform 0.18s ease;
        }
        .exp-card:hover {
          border-color: var(--teal-300);
          box-shadow: var(--shadow-sm);
          transform: translateY(-2px);
        }
        .exp-card.is-dense {
          padding: 12px 14px;
          gap: 12px;
        }
        .exp-card__icon {
          font-size: 2.6rem;
          width: 56px;
          height: 56px;
          flex-shrink: 0;
          display: grid;
          place-items: center;
          background: var(--surface-alt);
          border-radius: var(--radius-md);
        }
        .exp-card.is-dense .exp-card__icon {
          font-size: 1.6rem;
          width: 40px;
          height: 40px;
        }
        .exp-card__body { flex: 1; min-width: 0; }
        .exp-card__head {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
        }
        .exp-card__title {
          font-family: var(--font-display);
          font-size: 1.05rem;
          font-weight: 700;
          margin: 0 0 4px;
          color: var(--slate-900);
          line-height: 1.3;
        }
        .exp-card.is-dense .exp-card__title { font-size: 0.98rem; }
        .exp-card__desc {
          margin: 4px 0 8px;
          font-size: 0.9rem;
          color: var(--text-soft);
        }
        .exp-card__meta {
          display: flex;
          flex-wrap: wrap;
          gap: 6px 14px;
          align-items: center;
          font-size: 0.82rem;
          color: var(--slate-700);
        }
        .exp-card__actions {
          margin-top: 12px;
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
      `}</style>
    </article>
  );
}

function formatDuration(hours) {
  if (hours >= 24) {
    const days = (hours / 24).toFixed(hours % 24 === 0 ? 0 : 1);
    return `${days} days`;
  }
  if (hours >= 1) return `${hours}h`;
  return `${Math.round(hours * 60)}m`;
}
