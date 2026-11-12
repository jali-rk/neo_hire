import { REASONS } from '../content';

export default function WhyJoin() {
  return (
    <section className="section" id="why" aria-labelledby="why-title">
      <div className="wrap">
        <div className="section-head">
          <div>
            <p className="eyebrow">Why join</p>
            <h2 className="title" id="why-title">
              A founding role, <em>without the gamble.</em>
            </h2>
          </div>
          <p className="intro">
            Joining a founding team usually means trading security for influence. Here you get both: a say in how the
            studio works, and a business that already has customers.
          </p>
        </div>

        <div className="why-grid">
          {REASONS.map((r) => (
            <div className="why-item" key={r.title}>
              <h3>{r.title}</h3>
              <p>{r.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
