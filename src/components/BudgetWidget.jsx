import { useTrip } from '../context/TripContext.jsx';
import { getDestination } from '../data/destinations.js';

export default function BudgetWidget() {
  const { draft, draftStats } = useTrip();
  const destination = draft.destinationId ? getDestination(draft.destinationId) : null;
  const lodgingEstimate = destination
    ? destination.avgDailyBudget * draft.days * draft.travellers
    : 0;
  const grandTotal = draftStats.totalCost + lodgingEstimate;

  return (
    <aside className="budget">
      <header className="budget__head">
        <span className="eyebrow">Trip summary</span>
        <h3 style={{ marginBottom: 0 }}>{draft.name || 'Untitled trip'}</h3>
        {destination && (
          <p className="muted" style={{ margin: '4px 0 0', fontSize: '0.92rem' }}>
            {destination.emoji} {destination.name}, {destination.country}
          </p>
        )}
      </header>

      <ul className="budget__list">
        <li>
          <span>Days</span>
          <strong>{draft.days}</strong>
        </li>
        <li>
          <span>Travellers</span>
          <strong>{draft.travellers}</strong>
        </li>
        <li>
          <span>Experiences</span>
          <strong>{draftStats.experienceCount}</strong>
        </li>
        <li>
          <span>Activity hours</span>
          <strong>{Math.round(draftStats.totalHours * 10) / 10}h</strong>
        </li>
        <li className="budget__divider">
          <span>Activities cost</span>
          <strong>${draftStats.totalCost.toLocaleString()}</strong>
        </li>
        {destination && (
          <li>
            <span>
              Food + lodging
              <small> ({draft.travellers} × {draft.days} × ${destination.avgDailyBudget})</small>
            </span>
            <strong>${lodgingEstimate.toLocaleString()}</strong>
          </li>
        )}
        <li className="budget__total">
          <span>Estimated total</span>
          <strong>${grandTotal.toLocaleString()}</strong>
        </li>
      </ul>

      <p className="budget__note muted">
        💡 Estimates are indicative — actual prices vary by season and choices.
      </p>

      <style>{`
        .budget {
          position: sticky;
          top: 92px;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: 22px 22px 18px;
          box-shadow: var(--shadow-sm);
        }
        .budget__head { margin-bottom: 14px; }
        .budget__list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .budget__list li {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          font-size: 0.9rem;
          color: var(--slate-700);
        }
        .budget__list li small {
          display: block;
          color: var(--slate-400);
          font-size: 0.72rem;
        }
        .budget__list li strong {
          color: var(--slate-900);
          font-weight: 700;
        }
        .budget__divider {
          padding-top: 12px;
          border-top: 1px solid var(--border);
          margin-top: 4px;
        }
        .budget__total {
          padding: 12px 0 4px;
          border-top: 1px dashed var(--border);
          margin-top: 6px;
        }
        .budget__total strong {
          font-size: 1.25rem;
          color: var(--teal-700);
        }
        .budget__note {
          margin: 14px 0 0;
          font-size: 0.78rem;
        }
      `}</style>
    </aside>
  );
}
