import { useEffect, useRef, useState } from 'react';
import { ATELIER } from '../content';
import FitOnVideo from './FitOnVideo';

export default function Atelier() {
  const list = useRef<HTMLOListElement>(null);
  const [active, setActive] = useState(0);
  const [tracking, setTracking] = useState(false);

  // As each stage crosses the middle of the screen it becomes the highlighted one.
  useEffect(() => {
    const items = Array.from(list.current?.children ?? []) as HTMLElement[];
    if (!items.length || !('IntersectionObserver' in window)) return;
    setTracking(true);
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) setActive(items.indexOf(en.target as HTMLElement));
        });
      },
      { rootMargin: '-45% 0px -45% 0px' },
    );
    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <section className="section atelier dark" id="studio" aria-labelledby="studio-title">
      <div className="wrap">
        <div className="section-head" data-reveal="head">
          <div>
            <p className="eyebrow">3D studio</p>
            <h2 className="title" id="studio-title">
              {ATELIER.title} <em>{ATELIER.titleAccent}</em>
            </h2>
          </div>
          <p className="intro">{ATELIER.intro}</p>
        </div>

        <div className="atelier-grid">
          <ol className={`stages${tracking ? ' is-tracking' : ''}`} ref={list}>
            {ATELIER.stages.map((s, i) => (
              <li key={s.title} className={i === active ? 'is-active' : undefined}>
                <span className="stage-n drift" aria-hidden="true">
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
          <div className="film-col" data-reveal="curtain">
            <FitOnVideo />
          </div>
        </div>
      </div>
    </section>
  );
}
