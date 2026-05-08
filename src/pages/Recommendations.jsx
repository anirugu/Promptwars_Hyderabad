import { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import InterestSelector from '../components/InterestSelector.jsx';
import DestinationCard from '../components/DestinationCard.jsx';
import ExperienceCard from '../components/ExperienceCard.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { DESTINATIONS } from '../data/destinations.js';
import { EXPERIENCES, scoreExperience } from '../data/experiences.js';
import { useTrip } from '../context/TripContext.jsx';

const TOP_DESTINATIONS = 6;
const TOP_EXPERIENCES = 8;

export default function Recommendations() {
  const { interests } = useTrip();
  const navigate = useNavigate();

  /**
   * Destinations get scored by:
   *  - +2 for every interest tag the destination explicitly lists
   *  - +0.5 for every matching experience (capped to keep things linear)
   */
  const rankedDestinations = useMemo(() => {
    if (interests.length === 0) return DESTINATIONS;
    return DESTINATIONS
      .map((d) => {
        const directScore = d.interests.filter((i) => interests.includes(i)).length * 2;
        const expBonus = EXPERIENCES.filter(
          (e) => e.destinationId === d.id && scoreExperience(e, interests) >= 3
        ).length * 0.5;
        return { ...d, score: directScore + expBonus };
      })
      .sort((a, b) => b.score - a.score);
  }, [interests]);

  const rankedExperiences = useMemo(() => {
    if (interests.length === 0) return [];
    return EXPERIENCES
      .map((e) => ({ ...e, score: scoreExperience(e, interests) }))
      .filter((e) => e.score > 0)
      .sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return b.rating - a.rating;
      });
  }, [interests]);

  return (
    <section className="section container">
      <header style={{ marginBottom: 28 }}>
        <span className="eyebrow">For you</span>
        <h1 style={{ marginBottom: 8 }}>Personalised picks</h1>
        <p className="muted" style={{ maxWidth: 620 }}>
          A simple matching engine ranks destinations and experiences against
          your selected interests. The more interests you pick, the smarter the
          ranking gets.
        </p>
      </header>

      {/* Interest selector card */}
      <div className="card" style={{ padding: '28px 26px' }}>
        <InterestSelector />
      </div>

      {interests.length === 0 ? (
        <div style={{ marginTop: 24 }}>
          <EmptyState
            icon="✨"
            title="Pick a few interests above to see your matches"
            message="Even one interest unlocks personalised destination and experience recommendations."
          />
        </div>
      ) : (
        <>
          {/* Destinations */}
          <div className="flex--between" style={{ marginTop: 40, marginBottom: 14 }}>
            <div>
              <span className="eyebrow">Destinations · matched</span>
              <h2 style={{ margin: 0 }}>Where to go</h2>
            </div>
            <Link to="/explore" className="btn btn--ghost btn--small">
              Browse all →
            </Link>
          </div>
          <div className="grid grid--3">
            {rankedDestinations.slice(0, TOP_DESTINATIONS).map((d) => (
              <div key={d.id} style={{ position: 'relative' }}>
                {d.score > 0 && (
                  <span className="reco-badge">★ {Math.round(d.score * 10) / 10}</span>
                )}
                <DestinationCard destination={d} />
              </div>
            ))}
          </div>

          {/* Experiences */}
          <h2 style={{ marginTop: 48 }}>What to do</h2>
          <p className="muted" style={{ maxWidth: 620, marginBottom: 16 }}>
            The top {TOP_EXPERIENCES} hand-picked activities matching your
            vibes — across every destination.
          </p>
          {rankedExperiences.length === 0 ? (
            <EmptyState
              icon="🤔"
              title="No experience matches just yet"
              message="Try adding a different interest like Culture, Food or Adventure."
            />
          ) : (
            <div className="grid grid--2">
              {rankedExperiences.slice(0, TOP_EXPERIENCES).map((exp) => (
                <ExperienceCard
                  key={exp.id}
                  experience={exp}
                  showDestination
                  matchScore={exp.score}
                  actions={[
                    {
                      label: 'See destination',
                      variant: 'primary',
                      onClick: () => navigate(`/destinations/${exp.destinationId}`)
                    }
                  ]}
                />
              ))}
            </div>
          )}
        </>
      )}

      <style>{`
        .reco-badge {
          position: absolute;
          top: 14px;
          right: 14px;
          z-index: 2;
          background: var(--orange-500);
          color: #fff;
          padding: 4px 10px;
          border-radius: 999px;
          font-size: 0.78rem;
          font-weight: 700;
          letter-spacing: 0.04em;
          box-shadow: var(--shadow-sm);
        }
      `}</style>
    </section>
  );
}
