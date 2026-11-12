import { CRAFT_WORDS } from '../content';

/** A slow band of craft words between the hero and the company section. */
export default function Marquee() {
  return (
    <div className="marquee" role="region" aria-label="Our craft">
      <div className="marquee-track">
        <ul>
          {CRAFT_WORDS.map((w) => (
            <li key={w}>{w}</li>
          ))}
        </ul>
        {/* Second copy makes the loop seamless; hidden from screen readers */}
        <ul aria-hidden="true">
          {CRAFT_WORDS.map((w) => (
            <li key={w}>{w}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
