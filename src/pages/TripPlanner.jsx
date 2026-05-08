import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { DESTINATIONS, getDestination } from '../data/destinations.js';
import {
  getExperiencesByDestination,
  scoreExperience
} from '../data/experiences.js';
import { useTrip } from '../context/TripContext.jsx';
import ItineraryDay from '../components/ItineraryDay.jsx';
import ExperienceCard from '../components/ExperienceCard.jsx';
import BudgetWidget from '../components/BudgetWidget.jsx';
import EmptyState from '../components/EmptyState.jsx';

export default function TripPlanner() {
  const { id: paramId } = useParams();
  const navigate = useNavigate();
  const {
    draft,
    interests,
    updateDraft,
    startNewTrip,
    addExperienceToDay,
    saveDraftAsTrip,
    loadTripIntoDraft,
    clearDraft,
    savedTrips
  } = useTrip();
  const [activeDay, setActiveDay] = useState(1);
  const [confirmation, setConfirmation] = useState(null);

  // If a saved trip id is in the URL, load it into the draft once.
  useEffect(() => {
    if (paramId && draft.id !== paramId) {
      const loaded = loadTripIntoDraft(paramId);
      if (!loaded) navigate('/trips', { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramId]);

  const destination = draft.destinationId ? getDestination(draft.destinationId) : null;

  const usedExperiences = useMemo(() => {
    return new Set(Object.values(draft.itinerary ?? {}).flat());
  }, [draft.itinerary]);

  const availableExperiences = useMemo(() => {
    if (!destination) return [];
    return getExperiencesByDestination(destination.id)
      .filter((e) => !usedExperiences.has(e.id))
      .map((e) => ({ ...e, score: scoreExperience(e, interests) }))
      .sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return b.rating - a.rating;
      });
  }, [destination, usedExperiences, interests]);

  const dayKeys = Array.from({ length: draft.days }, (_, i) => i + 1);

  const handleSave = () => {
    if (!destination) return;
    const saved = saveDraftAsTrip();
    setConfirmation(`Saved “${saved.name}” to My Trips ✓`);
    setTimeout(() => setConfirmation(null), 2400);
  };

  const handleNew = () => {
    clearDraft();
    setActiveDay(1);
  };

  return (
    <section className="section container">
      <div className="planner__head">
        <div>
          <span className="eyebrow">Trip planner</span>
          <h1 style={{ marginBottom: 8 }}>
            {destination ? `Plan your ${destination.name} trip` : 'Plan a new trip'}
          </h1>
          <p className="muted" style={{ maxWidth: 620 }}>
            Pick a destination, set your dates and travellers, then drop
            experiences into each day. The budget on the right updates live.
          </p>
        </div>
        <div className="planner__actions">
          {savedTrips.length > 0 && (
            <Link to="/trips" className="btn btn--ghost btn--small">
              📁 My Trips ({savedTrips.length})
            </Link>
          )}
          <button
            type="button"
            className="btn btn--ghost btn--small"
            onClick={handleNew}
          >
            ↺ Reset draft
          </button>
        </div>
      </div>

      {confirmation && (
        <div className="toast" role="status">
          {confirmation}
        </div>
      )}

      {/* Destination picker */}
      {!destination && (
        <div className="card" style={{ padding: '24px 22px', marginTop: 24 }}>
          <h3 style={{ marginTop: 0 }}>Where are you going?</h3>
          <p className="muted">Pick a destination to start your itinerary.</p>
          <div className="grid grid--4" style={{ marginTop: 16 }}>
            {DESTINATIONS.map((d) => (
              <button
                key={d.id}
                type="button"
                className="dest-pick"
                onClick={() => startNewTrip(d.id)}
              >
                <span className="dest-pick__emoji" aria-hidden>
                  {d.emoji}
                </span>
                <strong>{d.name}</strong>
                <span className="muted">{d.country}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {destination && (
        <div className="planner-grid" style={{ marginTop: 24 }}>
          {/* LEFT: itinerary + form */}
          <div>
            {/* Trip details form */}
            <div className="card" style={{ padding: '22px' }}>
              <div className="planner-form">
                <div className="field" style={{ flex: '1 1 240px' }}>
                  <label htmlFor="trip-name">Trip name</label>
                  <input
                    id="trip-name"
                    value={draft.name}
                    onChange={(e) => updateDraft({ name: e.target.value })}
                    placeholder="e.g. Bali honeymoon"
                  />
                </div>
                <div className="field">
                  <label htmlFor="trip-start">Start date</label>
                  <input
                    id="trip-start"
                    type="date"
                    value={draft.startDate}
                    onChange={(e) => updateDraft({ startDate: e.target.value })}
                  />
                </div>
                <div className="field">
                  <label htmlFor="trip-days">Days</label>
                  <input
                    id="trip-days"
                    type="number"
                    min="1"
                    max="30"
                    value={draft.days}
                    onChange={(e) =>
                      updateDraft({
                        days: Math.max(1, Math.min(30, Number(e.target.value) || 1))
                      })
                    }
                  />
                </div>
                <div className="field">
                  <label htmlFor="trip-trav">Travellers</label>
                  <input
                    id="trip-trav"
                    type="number"
                    min="1"
                    max="20"
                    value={draft.travellers}
                    onChange={(e) =>
                      updateDraft({
                        travellers: Math.max(1, Math.min(20, Number(e.target.value) || 1))
                      })
                    }
                  />
                </div>
                <div className="field" style={{ flex: '1 1 100%' }}>
                  <label htmlFor="trip-notes">Notes</label>
                  <textarea
                    id="trip-notes"
                    rows="2"
                    value={draft.notes}
                    onChange={(e) => updateDraft({ notes: e.target.value })}
                    placeholder="Flight times, hotel name, packing reminders…"
                  />
                </div>
              </div>

              <div className="planner-form__cta">
                <button
                  type="button"
                  className="btn btn--ghost btn--small"
                  onClick={() => startNewTrip()}
                >
                  Change destination
                </button>
                <button
                  type="button"
                  className="btn btn--primary"
                  onClick={handleSave}
                  disabled={!destination}
                >
                  💾 Save trip
                </button>
              </div>
            </div>

            {/* Day tabs (mobile-friendly summary) */}
            <div className="day-tabs" style={{ marginTop: 24 }}>
              {dayKeys.map((d) => {
                const items = draft.itinerary[d] ?? [];
                return (
                  <button
                    key={d}
                    type="button"
                    className={`day-tab ${activeDay === d ? 'is-active' : ''}`}
                    onClick={() => setActiveDay(d)}
                  >
                    <strong>Day {d}</strong>
                    <span>{items.length} act.</span>
                  </button>
                );
              })}
            </div>

            {/* Itinerary days */}
            <div className="stack stack--lg" style={{ marginTop: 16 }}>
              {dayKeys.map((d) => (
                <ItineraryDay
                  key={d}
                  day={d}
                  experienceIds={draft.itinerary[d] ?? []}
                  totalDays={draft.days}
                />
              ))}
            </div>
          </div>

          {/* RIGHT: budget + experiences to add */}
          <div className="planner-side stack stack--lg">
            <BudgetWidget />

            <div className="card" style={{ padding: '20px 22px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  justifyContent: 'space-between',
                  gap: 8,
                  marginBottom: 12
                }}
              >
                <h3 style={{ margin: 0 }}>Add experiences</h3>
                <span className="muted" style={{ fontSize: '0.85rem' }}>
                  → Day {activeDay}
                </span>
              </div>

              {availableExperiences.length === 0 ? (
                <EmptyState
                  icon="🎉"
                  title="You added them all"
                  message="Great taste — every experience for this destination is in your itinerary."
                />
              ) : (
                <div className="stack">
                  {availableExperiences.map((exp) => (
                    <ExperienceCard
                      key={exp.id}
                      experience={exp}
                      dense
                      matchScore={exp.score}
                      actions={[
                        {
                          label: `Add to Day ${activeDay}`,
                          variant: 'accent',
                          onClick: () => addExperienceToDay(activeDay, exp.id)
                        }
                      ]}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <PlannerStyles />
    </section>
  );
}

function PlannerStyles() {
  return (
    <style>{`
      .planner__head {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 18px;
        flex-wrap: wrap;
      }
      .planner__actions { display: flex; gap: 8px; flex-wrap: wrap; }

      .toast {
        margin-top: 16px;
        background: var(--teal-100);
        color: var(--teal-900);
        border: 1px solid var(--teal-300);
        padding: 10px 16px;
        border-radius: 999px;
        font-weight: 600;
        display: inline-block;
      }

      .dest-pick {
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: var(--radius-lg);
        padding: 18px;
        text-align: center;
        cursor: pointer;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;
        transition: transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease;
      }
      .dest-pick:hover {
        transform: translateY(-3px);
        border-color: var(--teal-500);
        box-shadow: var(--shadow-sm);
      }
      .dest-pick__emoji { font-size: 2.4rem; }
      .dest-pick strong {
        font-family: var(--font-display);
        font-size: 1.05rem;
        color: var(--slate-900);
      }

      .planner-grid {
        display: grid;
        grid-template-columns: minmax(0, 1fr) 360px;
        gap: 28px;
        align-items: start;
      }

      .planner-form {
        display: flex;
        flex-wrap: wrap;
        gap: 14px;
      }
      .planner-form .field { flex: 1 1 140px; }
      .planner-form__cta {
        margin-top: 16px;
        display: flex;
        gap: 8px;
        justify-content: flex-end;
        flex-wrap: wrap;
      }

      .day-tabs {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
      }
      .day-tab {
        background: #fff;
        border: 1px solid var(--border);
        border-radius: var(--radius-md);
        padding: 10px 14px;
        cursor: pointer;
        display: flex;
        flex-direction: column;
        gap: 2px;
        text-align: left;
        min-width: 96px;
        transition: border-color 0.18s ease, background 0.18s ease;
      }
      .day-tab strong { font-family: var(--font-display); }
      .day-tab span { font-size: 0.78rem; color: var(--slate-500); }
      .day-tab.is-active {
        background: var(--slate-900);
        border-color: var(--slate-900);
      }
      .day-tab.is-active strong, .day-tab.is-active span { color: #fff; }
      .day-tab:hover:not(.is-active) {
        border-color: var(--teal-500);
      }

      @media (max-width: 1080px) {
        .planner-grid { grid-template-columns: 1fr; }
        .planner-side { order: -1; }
      }
    `}</style>
  );
}
