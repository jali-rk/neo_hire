import { DIVISIONS, FLOW, ROLES } from '../content';

export default function Studio() {
  return (
    <section className="section section-paper" id="studio" aria-labelledby="studio-title">
      <div className="wrap">
        <div className="section-head">
          <div>
            <p className="eyebrow">The studio</p>
            <h2 className="title" id="studio-title">
              One studio, <em>three divisions.</em>
            </h2>
          </div>
          <p className="intro">
            The Central Studio designs, engineers and quality-checks clothing for every Aphrodite division. Each division
            has its own customers and price point. The studio’s standards are shared.
          </p>
        </div>

        <div className="divisions">
          {DIVISIONS.map((d) => (
            <article className="division" key={d.name}>
              <span className={`status status-${d.stage}`}>{d.status}</span>
              <h3>{d.name}</h3>
              <p>{d.text}</p>
            </article>
          ))}
        </div>

        <h3 className="flow-title">How a garment moves through the studio</h3>
        <p className="flow-sub">Each stage has an owner. Each owner is one of the roles we’re hiring for.</p>
        <ol className="flow">
          {FLOW.map((step, i) => {
            const role = ROLES.find((r) => r.id === step.roleId)!;
            return (
              <li key={step.title}>
                <span className="n">{i + 1}</span>
                <h4>{step.title}</h4>
                <p>{step.text}</p>
                <a className="owner" href={`#role-${role.id}`}>
                  <span className="letter letter-sm">{role.letter}</span>
                  <span>{role.shortTitle}</span>
                </a>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
