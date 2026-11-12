import { HOUSE } from '../content';

export default function House() {
  return (
    <section className="section section-paper" id="company" aria-labelledby="company-title">
      <div className="wrap">
        <div className="house-grid">
          <div>
            <p className="eyebrow">The company</p>
            <h2 className="title" id="company-title">
              {HOUSE.title} <em>{HOUSE.titleAccent}</em>
            </h2>
          </div>
          <div className="house-text">
            {HOUSE.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
            <div className="note">
              <h3>{HOUSE.confidentiality.title}</h3>
              <p>{HOUSE.confidentiality.text}</p>
            </div>
          </div>
        </div>

        <ul className="metrics">
          {HOUSE.metrics.map((m) => (
            <li key={m.label}>
              <span className="metric-value">{m.value}</span>
              <h3>{m.label}</h3>
              <p>{m.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
