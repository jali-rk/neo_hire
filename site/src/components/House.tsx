import type React from 'react';
import { HOUSE } from '../content';
import CountUp from './CountUp';

export default function House() {
  return (
    <section className="section section-paper" id="company" aria-labelledby="company-title">
      <div className="wrap">
        <div className="house-grid">
          <div data-reveal>
            <p className="eyebrow">The company</p>
            <h2 className="title" id="company-title">
              {HOUSE.title} <em>{HOUSE.titleAccent}</em>
            </h2>
          </div>
          <div className="house-text" data-reveal style={{ '--rd': '.12s' } as React.CSSProperties}>
            {HOUSE.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
            <div className="note">
              <h3>{HOUSE.confidentiality.title}</h3>
              <p>{HOUSE.confidentiality.text}</p>
            </div>
          </div>
        </div>

        <ul className="metrics" data-reveal="stagger">
          {HOUSE.metrics.map((m) => (
            <li key={m.label}>
              <CountUp className="metric-value" value={m.value} />
              <h3>{m.label}</h3>
              <p>{m.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
