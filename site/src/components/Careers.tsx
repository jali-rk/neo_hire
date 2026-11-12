import { useState } from 'react';
import { OPEN_APPLICATION, OPEN_APPLICATION_CARD, ROLE_FILTERS, ROLES, type RoleCategory, type RoleId } from '../content';
import RoleDialog from './RoleDialog';

interface Props {
  openRole: RoleId | null;
  onOpenRole: (id: RoleId | null) => void;
  onApply: (role: string) => void;
}

export default function Careers({ openRole, onOpenRole, onApply }: Props) {
  const [filter, setFilter] = useState<RoleCategory | 'all'>('all');
  const shown = ROLES.filter((r) => filter === 'all' || r.category === filter);

  return (
    <section className="section" id="careers" aria-labelledby="careers-title">
      <div className="wrap">
        <div className="section-head">
          <div>
            <p className="eyebrow">Careers</p>
            <h2 className="title" id="careers-title">
              Founding <em>careers.</em>
            </h2>
          </div>
          <p className="intro">
            We recruit directly into Aphrodite (Pvt) Ltd, with full statutory EPF/ETF benefits, structured remuneration and
            a paid 1-day studio practical trial for shortlisted technical candidates.
          </p>
        </div>

        <div className="filters" role="group" aria-label="Filter roles">
          {ROLE_FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              className="filter"
              aria-pressed={filter === f.id}
              onClick={() => setFilter(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>

        <ul className="role-cards" aria-live="polite">
          {shown.map((role) => (
            <li key={role.id} className="role-card">
              <p className="role-type">{role.type}</p>
              <h3>{role.title}</h3>
              <p className="role-summary">{role.summary}</p>
              <dl className="role-facts">
                <div>
                  <dt>Team</dt>
                  <dd>{role.team}</dd>
                </div>
                <div>
                  <dt>Experience</dt>
                  <dd>{role.experience}</dd>
                </div>
              </dl>
              <div className="role-card-actions">
                <a
                  className="btn btn-ghost btn-sm"
                  href={`#role-${role.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    onOpenRole(role.id);
                  }}
                >
                  View role details
                  <span className="sr-only">: {role.title}</span>
                </a>
                <a className="text-link" href="#apply" onClick={() => onApply(role.title)}>
                  Apply<span className="sr-only"> for {role.title}</span>
                </a>
              </div>
            </li>
          ))}
        </ul>

        <div className="open-app">
          <div>
            <h3>{OPEN_APPLICATION_CARD.title}</h3>
            <p>{OPEN_APPLICATION_CARD.text}</p>
          </div>
          <a className="btn btn-ghost" href="#apply" onClick={() => onApply(OPEN_APPLICATION)}>
            Send an open application
          </a>
        </div>
      </div>

      {ROLES.map((role) => (
        <RoleDialog
          key={role.id}
          role={role}
          open={openRole === role.id}
          onClose={() => onOpenRole(null)}
          onApply={() => {
            onOpenRole(null);
            onApply(role.title);
          }}
        />
      ))}
    </section>
  );
}
