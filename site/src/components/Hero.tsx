import { BENEFITS, HERO } from '../content';
import JacketDrawing from './JacketDrawing';

export default function Hero() {
  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <div className="wrap hero-grid">
        <div className="hero-copy">
          <p className="eyebrow">{HERO.eyebrow}</p>
          <h1 id="hero-title">{HERO.title}</h1>
          <p className="lede">{HERO.lede}</p>
          <div className="hero-actions">
            <a className="btn btn-primary" href="#careers">
              View open roles
            </a>
            <a className="btn btn-ghost" href="#apply">
              Apply now
            </a>
          </div>
          <ul className="ticks benefits" aria-label="What we offer">
            {BENEFITS.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
        </div>
        <div className="hero-art paper">
          <JacketDrawing />
        </div>
      </div>
    </section>
  );
}
