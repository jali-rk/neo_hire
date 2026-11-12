import { useState } from 'react';
import { HIGHLIGHTS, OPEN_APPLICATION, ROLES, type RoleId } from '../content';
import JacketFlat from './JacketFlat';

interface Props {
  onApply: (role: string) => void;
}

export default function Hero({ onApply }: Props) {
  const [active, setActive] = useState<RoleId | null>(null);

  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <div className="wrap">
        <p className="eyebrow">Now hiring · Central Studio, Sri Lanka</p>
        <h1 id="hero-title">
          We’re hiring five people to build a fashion house <em>from the first stitch.</em>
        </h1>

        <div className="hero-sub">
          <p className="lede">
            Aphrodite (Pvt) Ltd is a Sri Lankan apparel group. Our ready-to-wear division already supplies retailers
            across the island, and a new neo-luxury label launches in July 2027. Both are designed and made through one
            central studio, and we’re hiring the team that will run it.
          </p>
          <div className="hero-actions">
            <a className="btn btn-primary" href="#roles">
              See the five roles
            </a>
            <a className="btn btn-ghost" href="#apply">
              Apply now
            </a>
          </div>
        </div>

        <ul className="facts" aria-label="At a glance">
          {HIGHLIGHTS.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>

        {/* Spec sheet: each role is a point of measure on the garment */}
        <div className="sheet">
          <div className="sheet-head">
            <span>
              Spec sheet · <b>Founding team</b>
            </span>
            <span className="live">{ROLES.length} open roles</span>
          </div>

          <div className="sheet-body">
            <figure className="sheet-figure">
              <JacketFlat active={active} onActive={setActive} />
              <figcaption>
                Every point on this jacket has someone responsible for it. These are the five people we’re looking for.
              </figcaption>
            </figure>

            <div className="pom">
              <div className="pom-head" aria-hidden="true">
                <span>Point</span>
                <span>Role</span>
                <span>Responsible for</span>
                <span />
              </div>
              {ROLES.map((role) => (
                <a
                  key={role.id}
                  className={`pom-row${active === role.id ? ' is-active' : ''}`}
                  href={`#role-${role.id}`}
                  onMouseEnter={() => setActive(role.id)}
                  onMouseLeave={() => setActive(null)}
                  onFocus={() => setActive(role.id)}
                  onBlur={() => setActive(null)}
                >
                  <span className="letter">{role.letter}</span>
                  <span className="pom-role">{role.shortTitle}</span>
                  <span className="pom-resp">{role.responsibility}</span>
                  <span className="pom-go" aria-hidden="true">
                    →
                  </span>
                </a>
              ))}
              <div className="pom-foot">
                <span>Not your role?</span>
                <a className="text-link" href="#apply" onClick={() => onApply(OPEN_APPLICATION)}>
                  Send an open application
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
