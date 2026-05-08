import { Link } from 'react-router-dom';
import DestinationCard from '../components/DestinationCard.jsx';
import InterestSelector from '../components/InterestSelector.jsx';
import { DESTINATIONS } from '../data/destinations.js';
import { useTrip } from '../context/TripContext.jsx';

export default function Home() {
  const featured = DESTINATIONS.slice(0, 4);
  const { interests, savedTrips } = useTrip();

  return (
    <>
      {/* HERO ----------------------------------------------------------- */}
      <section className="hero">
        <div className="container hero__inner">
          <div className="hero__copy">
            <span className="eyebrow">✦ Travel plan & experience engine</span>
            <h1>
              Plan trips you’ll <em>actually</em> remember.
            </h1>
            <p className="hero__lede">
              WanderForge curates destinations and experiences, then helps you
              build a day-by-day itinerary with a live budget. Tell us what
              you love — we do the rest.
            </p>
            <div className="hero__cta">
              <Link to="/recommendations" className="btn btn--accent">
                Get personalised picks →
              </Link>
              <Link to="/explore" className="btn btn--ghost">
                Explore destinations
              </Link>
            </div>
            <div className="hero__stats">
              <div>
                <strong>{DESTINATIONS.length}</strong>
                <span>handpicked destinations</span>
              </div>
              <div>
                <strong>35+</strong>
                <span>curated experiences</span>
              </div>
              <div>
                <strong>{savedTrips.length}</strong>
                <span>of your saved trips</span>
              </div>
            </div>
          </div>
          <div className="hero__art" aria-hidden>
            <div className="hero__cardA">🏝️ Bali</div>
            <div className="hero__cardB">⛩️ Kyoto</div>
            <div className="hero__cardC">🏔️ Patagonia</div>
            <div className="hero__compass">🧭</div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS --------------------------------------------------- */}
      <section className="section container">
        <span className="eyebrow">How WanderForge works</span>
        <h2>Three steps to your dream itinerary</h2>
        <div className="grid grid--3" style={{ marginTop: 24 }}>
          {[
            {
              n: 1,
              t: 'Tell us what you love',
              d: 'Pick a few interests — adventure, food, culture, wellness, etc.',
              e: '🎯'
            },
            {
              n: 2,
              t: 'Discover & shortlist',
              d: 'We rank destinations and experiences using a smart matching score.',
              e: '✨'
            },
            {
              n: 3,
              t: 'Build & track your plan',
              d: 'Drag activities into days, see costs in real time, save unlimited trips.',
              e: '📋'
            }
          ].map((s) => (
            <div key={s.n} className="how-card">
              <span className="how-card__icon">{s.e}</span>
              <strong>0{s.n} · {s.t}</strong>
              <p>{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* INTERESTS QUICK START ----------------------------------------- */}
      <section className="section container" style={{ paddingTop: 0 }}>
        <div className="card" style={{ padding: '32px 28px' }}>
          <InterestSelector />
          {interests.length > 0 && (
            <div style={{ marginTop: 18 }}>
              <Link to="/recommendations" className="btn btn--primary">
                See {interests.length} interest{interests.length === 1 ? '' : 's'}-based picks
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* FEATURED DESTINATIONS ----------------------------------------- */}
      <section className="section container">
        <div className="flex--between" style={{ marginBottom: 24 }}>
          <div>
            <span className="eyebrow">Featured</span>
            <h2 style={{ margin: 0 }}>Wanderlust starting points</h2>
          </div>
          <Link to="/explore" className="btn btn--ghost btn--small">
            See all →
          </Link>
        </div>
        <div className="grid grid--3">
          {featured.map((d) => (
            <DestinationCard key={d.id} destination={d} />
          ))}
        </div>
      </section>

      {/* CTA BAND ------------------------------------------------------ */}
      <section className="section container">
        <div className="cta-band">
          <div>
            <h2>Ready to forge your next journey?</h2>
            <p>
              Build a multi-day itinerary, drop activities into each day, and
              watch the budget update live.
            </p>
          </div>
          <Link to="/planner" className="btn btn--accent">
            Start planning
          </Link>
        </div>
      </section>

      <HomeStyles />
    </>
  );
}

function HomeStyles() {
  return (
    <style>{`
      .hero {
        background:
          radial-gradient(900px 460px at 12% -10%, rgba(20,184,166,0.18), transparent 60%),
          radial-gradient(700px 460px at 100% 0%, rgba(249,115,22,0.18), transparent 60%),
          var(--bg);
        padding: 72px 0 56px;
      }
      .hero__inner {
        display: grid;
        grid-template-columns: 1.2fr 1fr;
        gap: 64px;
        align-items: center;
      }
      .hero__copy h1 em {
        font-style: normal;
        background: linear-gradient(90deg, var(--teal-700), var(--orange-500));
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }
      .hero__lede {
        font-size: 1.1rem;
        max-width: 540px;
        color: var(--slate-700);
      }
      .hero__cta {
        display: flex;
        gap: 12px;
        flex-wrap: wrap;
        margin: 16px 0 32px;
      }
      .hero__stats {
        display: flex;
        gap: 32px;
        flex-wrap: wrap;
      }
      .hero__stats > div {
        display: flex;
        flex-direction: column;
      }
      .hero__stats strong {
        font-family: var(--font-display);
        font-size: 1.8rem;
        color: var(--slate-900);
      }
      .hero__stats span {
        font-size: 0.82rem;
        color: var(--slate-500);
        text-transform: uppercase;
        letter-spacing: 0.1em;
      }

      .hero__art {
        position: relative;
        aspect-ratio: 1/1;
        max-width: 460px;
        margin-left: auto;
      }
      .hero__art > div {
        position: absolute;
        font-family: var(--font-display);
        font-weight: 700;
        font-size: 1.3rem;
        padding: 20px 24px;
        border-radius: var(--radius-lg);
        color: #fff;
        box-shadow: var(--shadow-lg);
      }
      .hero__cardA {
        top: 8%;
        left: 4%;
        background: linear-gradient(135deg, #fde68a, #fb923c, #0f766e);
        transform: rotate(-6deg);
      }
      .hero__cardB {
        top: 22%;
        right: 0;
        background: linear-gradient(135deg, #fecaca, #f472b6, #7c3aed);
        transform: rotate(4deg);
      }
      .hero__cardC {
        bottom: 6%;
        left: 18%;
        background: linear-gradient(135deg, #cffafe, #14b8a6, #0f172a);
        transform: rotate(-3deg);
      }
      .hero__compass {
        position: absolute;
        bottom: 4%;
        right: 6%;
        font-size: 5rem;
        background: #fff;
        border-radius: 50%;
        width: 110px;
        height: 110px;
        display: grid;
        place-items: center;
        box-shadow: var(--shadow-md);
        animation: spin 18s linear infinite;
      }
      @keyframes spin {
        from { transform: rotate(0); }
        to { transform: rotate(360deg); }
      }

      .how-card {
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: var(--radius-lg);
        padding: 24px;
        transition: transform 0.18s ease, box-shadow 0.18s ease;
      }
      .how-card:hover {
        transform: translateY(-4px);
        box-shadow: var(--shadow-md);
      }
      .how-card__icon {
        font-size: 2.4rem;
        display: block;
        margin-bottom: 12px;
      }
      .how-card strong {
        display: block;
        font-family: var(--font-display);
        font-size: 1.1rem;
        margin-bottom: 6px;
        color: var(--slate-900);
      }

      .cta-band {
        background: linear-gradient(135deg, var(--slate-900), var(--teal-900));
        color: #fff;
        border-radius: var(--radius-xl);
        padding: 40px 36px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 24px;
        flex-wrap: wrap;
      }
      .cta-band h2 { color: #fff; margin: 0 0 8px; }
      .cta-band p { color: #cbd5e1; max-width: 520px; margin: 0; }

      @media (max-width: 880px) {
        .hero__inner { grid-template-columns: 1fr; gap: 32px; }
        .hero__art { max-width: 360px; margin: 0 auto; }
      }
    `}</style>
  );
}
