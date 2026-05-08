import { useState } from 'react';
import ExperienceCard from './ExperienceCard.jsx';
import { getExperience } from '../data/experiences.js';
import { useTrip } from '../context/TripContext.jsx';

export default function ItineraryDay({ day, experienceIds, totalDays }) {
  const { removeExperienceFromDay, moveExperience } = useTrip();
  const [drag, setDrag] = useState(null);

  const dayHours = experienceIds
    .map(getExperience)
    .filter(Boolean)
    .reduce((s, e) => s + e.duration, 0);

  const handleDrop = (e) => {
    e.preventDefault();
    setDrag(null);
    const data = e.dataTransfer.getData('text/plain');
    if (!data) return;
    try {
      const { fromDay, experienceId } = JSON.parse(data);
      moveExperience(Number(fromDay), Number(day), experienceId);
    } catch {
      /* noop */
    }
  };

  return (
    <section
      className={`itinerary-day ${drag === 'over' ? 'is-over' : ''}`}
      onDragOver={(e) => {
        e.preventDefault();
        setDrag('over');
      }}
      onDragLeave={() => setDrag(null)}
      onDrop={handleDrop}
    >
      <header className="itinerary-day__head">
        <h3 className="itinerary-day__title">Day {day}</h3>
        <span className="muted" style={{ fontSize: '0.85rem' }}>
          {experienceIds.length
            ? `${experienceIds.length} experience${
                experienceIds.length === 1 ? '' : 's'
              } · ${formatHours(dayHours)}`
            : 'Drop activities here'}
        </span>
      </header>

      {experienceIds.length === 0 ? (
        <div className="itinerary-day__empty">
          <p>No activities yet — pick from the “Add experiences” panel →</p>
        </div>
      ) : (
        <ul className="itinerary-day__list">
          {experienceIds.map((id) => {
            const exp = getExperience(id);
            if (!exp) return null;
            return (
              <li
                key={id}
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData(
                    'text/plain',
                    JSON.stringify({ fromDay: day, experienceId: id })
                  );
                }}
              >
                <ExperienceCard
                  experience={exp}
                  dense
                  actions={[
                    {
                      label: 'Remove',
                      variant: 'ghost',
                      onClick: () => removeExperienceFromDay(day, id)
                    }
                  ]}
                />
                {totalDays > 1 && (
                  <div className="itinerary-day__move">
                    <span>Move to:</span>
                    {Array.from({ length: totalDays }, (_, i) => i + 1)
                      .filter((d) => d !== day)
                      .map((d) => (
                        <button
                          key={d}
                          type="button"
                          className="chip chip--button"
                          onClick={() => moveExperience(day, d, id)}
                        >
                          Day {d}
                        </button>
                      ))}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}

      <style>{`
        .itinerary-day {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: 20px 22px 22px;
          transition: border-color 0.18s ease, background 0.18s ease;
        }
        .itinerary-day.is-over {
          border-color: var(--teal-500);
          background: var(--teal-50);
        }
        .itinerary-day__head {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 14px;
          flex-wrap: wrap;
        }
        .itinerary-day__title {
          font-family: var(--font-display);
          font-weight: 700;
          font-size: 1.4rem;
          margin: 0;
          color: var(--slate-900);
        }
        .itinerary-day__empty {
          border: 2px dashed var(--border);
          border-radius: var(--radius-md);
          padding: 22px;
          text-align: center;
        }
        .itinerary-day__empty p { margin: 0; font-size: 0.9rem; }
        .itinerary-day__list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .itinerary-day__list > li {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .itinerary-day__move {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          padding-left: 4px;
          font-size: 0.78rem;
          color: var(--text-soft);
          align-items: center;
        }
      `}</style>
    </section>
  );
}

function formatHours(h) {
  if (h >= 24) return `${Math.round((h / 24) * 10) / 10} days`;
  return `${Math.round(h * 10) / 10}h`;
}
