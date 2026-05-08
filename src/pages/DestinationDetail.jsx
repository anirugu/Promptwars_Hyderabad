import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  scoreExperience,
  getExperiencesByDestination
} from '../data/experiences.js';
import { getDestination } from '../data/destinations.js';
import ExperienceCard from '../components/ExperienceCard.jsx';
import { useTrip } from '../context/TripContext.jsx';
import { getInterest } from '../data/interests.js';

export default function DestinationDetail() {
  const { id } = useParams();
  const destination = getDestination(id);
  const navigate = useNavigate();
  const { interests, draft, addExperienceToDay, startNewTrip } = useTrip();
  const [filter, setFilter] = useState('all');

  // Hooks must be called unconditionally — handle the missing destination
  // case below the hook calls.
  const allExperiences = useMemo(
    () => (destination ? getExperiencesByDestination(destination.id) : []),
    [destination]
  );

  const sortedExperiences = useMemo(() => {
    return allExperiences
      .map((e) => ({ ...e, score: scoreExperience(e, interests) }))
      .filter(
        (e) =>
          filter === 'all' || e.category === filter || e.tags.includes(filter)
      )
      .sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return b.rating - a.rating;
      });
  }, [allExperiences, interests, filter]);

  const availableCategories = useMemo(() => {
    const ids = new Set(['all']);
    allExperiences.forEach((e) => {
      ids.add(e.category);
      e.tags.forEach((t) => ids.add(t));
    });
    return Array.from(ids);
  }, [allExperiences]);

  if (!destination) {
    return (
      <section className="section container">
        <h1>Destination not found</h1>
        <p>Try another destination from the explore page.</p>
        <Link to="/explore" className="btn btn--primary">Back to Explore</Link>
      </section>
    );
  }

  const inDraft = draft.destinationId === destination.id;

  const planThisDestination = () => {
    startNewTrip(destination.id);
    navigate('/planner');
  };

  const addToTripDay1 = (experienceId) => {
    if (!inDraft) startNewTrip(destination.id);
    addExperienceToDay(1, experienceId);
  };

  return (
    <>
      {/* HERO */}
      <section className="dest-hero" style={{ background: destination.gradient }}>
        <div className="container dest-hero__inner">
          <div className="dest-hero__copy">
            <span className="dest-hero__back">
              <Link to="/explore">← Back to explore</Link>
            </span>
            <h1>
              <span aria-hidden style={{ marginRight: 12 }}>
                {destination.emoji}
              </span>
              {destination.name}
            </h1>
            <p className="dest-hero__country">
              {destination.country} · {destination.region}
            </p>
            <p className="dest-hero__tagline">{destination.tagline}</p>
            <div className="dest-hero__cta">
              <button
                type="button"
                className="btn btn--accent"
                onClick={planThisDestination}
              >
                Plan a trip here
              </button>
              <Link to="/recommendations" className="btn btn--ghost btn--ghost-light">
                See personalised picks
              </Link>
            </div>
          </div>
          <div className="dest-hero__facts">
            <Fact label="Best season" value={destination.bestSeason} />
            <Fact label="Avg / day" value={`$${destination.avgDailyBudget}`} />
            <Fact label="Currency" value={destination.currency} />
            <Fact label="Languages" value={destination.languages.join(', ')} />
          </div>
        </div>
      </section>

      {/* DESCRIPTION + HIGHLIGHTS */}
      <section className="section container dest-grid">
        <article>
          <span className="eyebrow">About</span>
          <h2>Why visit {destination.name}?</h2>
          <p style={{ fontSize: '1.05rem', maxWidth: 700 }}>
            {destination.description}
          </p>

          <h3 style={{ marginTop: 32 }}>Don’t-miss highlights</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {destination.highlights.map((h) => (
              <span key={h} className="chip chip--teal chip--lg">📍 {h}</span>
            ))}
          </div>

          <h3 style={{ marginTop: 32 }}>Local tips</h3>
          <ul className="tips">
            {destination.tips.map((tip, i) => (
              <li key={i}>
                <span aria-hidden>💡</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </article>

        <aside className="dest-side">
          <h3>Vibes</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 18 }}>
            {destination.interests.map((i) => {
              const meta = getInterest(i);
              return meta ? (
                <span key={i} className="chip chip--accent">
                  {meta.emoji} {meta.label}
                </span>
              ) : null;
            })}
          </div>
          <div className="info-callout">
            <strong>Heads up</strong>
            <p>
              All prices are USD estimates per person. Tap “Add to trip” on any
              experience to drop it into Day 1 of your itinerary — you can
              re-arrange days afterwards.
            </p>
          </div>
        </aside>
      </section>

      {/* EXPERIENCES */}
      <section className="section container">
        <div className="flex--between">
          <div>
            <span className="eyebrow">Curated experiences</span>
            <h2 style={{ margin: 0 }}>Things to do in {destination.name}</h2>
          </div>
          <span className="muted">{sortedExperiences.length} ideas</span>
        </div>

        <div className="dest-filters" style={{ marginTop: 16 }}>
          {availableCategories.map((cat) => {
            const meta = cat === 'all' ? null : getInterest(cat);
            return (
              <button
                key={cat}
                type="button"
                className={`chip chip--button ${filter === cat ? 'is-active' : ''}`}
                onClick={() => setFilter(cat)}
              >
                {cat === 'all' ? 'All' : `${meta?.emoji ?? ''} ${meta?.label ?? cat}`}
              </button>
            );
          })}
        </div>

        <div className="grid grid--2" style={{ marginTop: 18 }}>
          {sortedExperiences.map((exp) => (
            <ExperienceCard
              key={exp.id}
              experience={exp}
              matchScore={exp.score}
              actions={[
                {
                  label: inDraft ? 'Add to Day 1' : 'Start trip with this',
                  variant: 'primary',
                  onClick: () => addToTripDay1(exp.id)
                }
              ]}
            />
          ))}
        </div>
      </section>

      <DestStyles />
    </>
  );
}

function Fact({ label, value }) {
  return (
    <div className="fact">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function DestStyles() {
  return (
    <style>{`
      .dest-hero {
        color: #fff;
        padding: 72px 0 56px;
        position: relative;
      }
      .dest-hero::after {
        content: '';
        position: absolute;
        inset: 0;
        background: linear-gradient(180deg, rgba(15,23,42,0) 50%, rgba(15,23,42,0.35) 100%);
        pointer-events: none;
      }
      .dest-hero__inner {
        position: relative;
        display: grid;
        grid-template-columns: 1.4fr 1fr;
        gap: 40px;
        align-items: end;
        z-index: 1;
      }
      .dest-hero h1 {
        color: #fff;
        font-size: clamp(2.4rem, 4.6vw, 3.8rem);
      }
      .dest-hero__back a {
        color: rgba(255,255,255,0.85);
        font-weight: 600;
        font-size: 0.9rem;
      }
      .dest-hero__back a:hover { color: #fff; }
      .dest-hero__country {
        color: rgba(255,255,255,0.85);
        text-transform: uppercase;
        letter-spacing: 0.12em;
        font-size: 0.78rem;
        font-weight: 700;
        margin: 0 0 12px;
      }
      .dest-hero__tagline {
        font-size: 1.2rem;
        color: rgba(255,255,255,0.92);
        max-width: 580px;
        margin-bottom: 24px;
      }
      .dest-hero__cta { display: flex; gap: 12px; flex-wrap: wrap; }
      .btn--ghost-light {
        background: rgba(255,255,255,0.18);
        color: #fff !important;
        border-color: rgba(255,255,255,0.4);
      }
      .btn--ghost-light:hover {
        background: #fff;
        color: var(--slate-900) !important;
        border-color: #fff;
      }
      .dest-hero__facts {
        background: rgba(255,255,255,0.92);
        color: var(--slate-900);
        border-radius: var(--radius-lg);
        padding: 22px;
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 14px 18px;
        backdrop-filter: blur(6px);
        box-shadow: var(--shadow-md);
      }
      .fact span {
        display: block;
        font-size: 0.7rem;
        text-transform: uppercase;
        letter-spacing: 0.12em;
        color: var(--slate-500);
        margin-bottom: 4px;
      }
      .fact strong {
        font-family: var(--font-display);
        font-size: 1rem;
        color: var(--slate-900);
      }

      .dest-grid {
        display: grid;
        grid-template-columns: 2.2fr 1fr;
        gap: 48px;
        align-items: start;
      }
      .dest-side {
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: var(--radius-lg);
        padding: 22px;
      }
      .dest-side h3 { margin-top: 0; }
      .info-callout {
        background: var(--teal-50);
        border: 1px solid var(--teal-100);
        border-radius: var(--radius-md);
        padding: 14px 16px;
        font-size: 0.9rem;
      }
      .info-callout strong { display: block; margin-bottom: 6px; color: var(--teal-900); }
      .info-callout p { margin: 0; color: var(--teal-900); }

      .tips {
        list-style: none;
        padding: 0;
        margin: 0;
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
      .tips li {
        display: flex;
        gap: 10px;
        align-items: flex-start;
      }

      .dest-filters {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }

      @media (max-width: 880px) {
        .dest-hero__inner { grid-template-columns: 1fr; gap: 24px; }
        .dest-grid { grid-template-columns: 1fr; gap: 28px; }
      }
    `}</style>
  );
}
