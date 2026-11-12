import { ATELIER } from '../content';
import FitOnVideo from './FitOnVideo';

export default function Atelier() {
  return (
    <section className="section atelier dark" id="studio" aria-labelledby="studio-title">
      <div className="wrap">
        <div className="section-head">
          <div>
            <p className="eyebrow">3D studio</p>
            <h2 className="title" id="studio-title">
              {ATELIER.title} <em>{ATELIER.titleAccent}</em>
            </h2>
          </div>
          <p className="intro">{ATELIER.intro}</p>
        </div>

        <div className="atelier-grid">
          <ol className="stages">
            {ATELIER.stages.map((s, i) => (
              <li key={s.title}>
                <span className="stage-n" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <h3>
                    <span className="sr-only">Stage {i + 1}: </span>
                    {s.title}
                  </h3>
                  <p>{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
          <FitOnVideo />
        </div>
      </div>
    </section>
  );
}
