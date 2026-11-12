import { DIVISIONS } from '../content';

export default function Divisions() {
  return (
    <section className="section" id="divisions" aria-labelledby="divisions-title">
      <div className="wrap">
        <div className="section-head" data-reveal>
          <div>
            <p className="eyebrow">Divisions</p>
            <h2 className="title" id="divisions-title">
              Three <em>strategic</em> divisions.
            </h2>
          </div>
          <p className="intro">
            Each division has its own creative direction, pricing and market channel, and draws on the technical skills of
            our Central Studio.
          </p>
        </div>

        <div className="divisions" data-reveal="stagger">
          {DIVISIONS.map((d) => (
            <article className={`division division-${d.stage}`} key={d.name}>
              <div className="division-top">
                <span className="division-number">{d.number}</span>
                <span className={`status status-${d.stage}`}>{d.status}</span>
              </div>
              <h3>{d.name}</h3>
              <p>{d.text}</p>
              <dl>
                {d.facts.map(([k, v]) => (
                  <div key={k}>
                    <dt>{k}</dt>
                    <dd>{v}</dd>
                  </div>
                ))}
              </dl>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
