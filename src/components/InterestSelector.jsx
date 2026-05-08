import { INTERESTS } from '../data/interests.js';
import { useTrip } from '../context/TripContext.jsx';

export default function InterestSelector({ compact = false }) {
  const { interests, toggleInterest, clearInterests } = useTrip();

  return (
    <div className={`interests ${compact ? 'is-compact' : ''}`}>
      <div className="interests__head">
        <div>
          <h3 style={{ marginBottom: 4 }}>What kind of trip excites you?</h3>
          <p className="muted" style={{ margin: 0 }}>
            Pick a few — we’ll tailor the recommendations.
          </p>
        </div>
        {interests.length > 0 && (
          <button
            type="button"
            className="btn btn--ghost btn--small"
            onClick={clearInterests}
          >
            Clear all
          </button>
        )}
      </div>

      <div className="interests__grid">
        {INTERESTS.map((interest) => {
          const active = interests.includes(interest.id);
          return (
            <button
              key={interest.id}
              type="button"
              className={`chip chip--button chip--lg ${active ? 'is-active' : ''}`}
              onClick={() => toggleInterest(interest.id)}
            >
              <span aria-hidden>{interest.emoji}</span>
              {interest.label}
            </button>
          );
        })}
      </div>

      <style>{`
        .interests__head {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 16px;
          flex-wrap: wrap;
        }
        .interests__grid {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }
        .interests.is-compact h3 { font-size: 1.1rem; }
      `}</style>
    </div>
  );
}
