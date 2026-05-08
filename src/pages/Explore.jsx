import { useMemo, useState } from 'react';
import DestinationCard from '../components/DestinationCard.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { DESTINATIONS, REGIONS } from '../data/destinations.js';
import { INTERESTS } from '../data/interests.js';

export default function Explore() {
  const [region, setRegion] = useState('All');
  const [interest, setInterest] = useState('all');
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('recommended');

  const filtered = useMemo(() => {
    let list = DESTINATIONS.slice();
    if (region !== 'All') list = list.filter((d) => d.region === region);
    if (interest !== 'all') list = list.filter((d) => d.interests.includes(interest));
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.country.toLowerCase().includes(q) ||
          d.tagline.toLowerCase().includes(q)
      );
    }
    if (sort === 'budget-asc') list.sort((a, b) => a.avgDailyBudget - b.avgDailyBudget);
    if (sort === 'budget-desc') list.sort((a, b) => b.avgDailyBudget - a.avgDailyBudget);
    if (sort === 'name') list.sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [region, interest, query, sort]);

  return (
    <section className="section container">
      <header style={{ marginBottom: 28 }}>
        <span className="eyebrow">Explore</span>
        <h1 style={{ marginBottom: 8 }}>Find your next destination</h1>
        <p className="muted" style={{ maxWidth: 620 }}>
          Filter by region, vibe or budget — every destination ships with a
          curated list of experiences and local tips.
        </p>
      </header>

      {/* Filters */}
      <div className="explore-filters">
        <div className="field">
          <label htmlFor="explore-q">Search</label>
          <input
            id="explore-q"
            placeholder="e.g. Bali, Japan, glaciers…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor="explore-r">Region</label>
          <select
            id="explore-r"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
          >
            {REGIONS.map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="explore-i">Vibe</label>
          <select
            id="explore-i"
            value={interest}
            onChange={(e) => setInterest(e.target.value)}
          >
            <option value="all">Any vibe</option>
            {INTERESTS.map((i) => (
              <option key={i.id} value={i.id}>
                {i.emoji} {i.label}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="explore-s">Sort</label>
          <select
            id="explore-s"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="recommended">Recommended</option>
            <option value="budget-asc">Budget · low to high</option>
            <option value="budget-desc">Budget · high to low</option>
            <option value="name">Name (A → Z)</option>
          </select>
        </div>
      </div>

      <p className="muted" style={{ marginTop: 18 }}>
        Showing <strong>{filtered.length}</strong> destination
        {filtered.length === 1 ? '' : 's'}.
      </p>

      {filtered.length === 0 ? (
        <EmptyState
          icon="🧭"
          title="No matches yet"
          message="Try removing a filter or searching for something different."
        />
      ) : (
        <div className="grid grid--3" style={{ marginTop: 16 }}>
          {filtered.map((d) => (
            <DestinationCard key={d.id} destination={d} />
          ))}
        </div>
      )}

      <style>{`
        .explore-filters {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
          gap: 14px;
          background: var(--surface);
          border: 1px solid var(--border);
          padding: 18px;
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-xs);
        }
        @media (max-width: 760px) {
          .explore-filters { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 480px) {
          .explore-filters { grid-template-columns: 1fr; }
        }
      `}</style>
    </section>
  );
}
