import type { CSSProperties } from 'react';

/** Animation delay for the line-drawing intro. */
const delay = (seconds: number) => ({ '--d': `${seconds}s` }) as CSSProperties;

/** Left half of the jacket. The right half is the same paths, mirrored. */
const HALF_LINES: { d: string; at: number }[] = [
  { d: 'M184,52 L122,74 C128,110 128,148 138,166 L146,262 L138,392 Q172,401 200,401 Q210,401 210,390 L210,236', at: 0 }, // body
  { d: 'M122,74 C104,84 98,112 96,150 L86,330 L122,336 L138,166', at: 0.15 }, // sleeve
  { d: 'M184,52 L166,96 L173,103 L152,110 C166,160 192,206 210,236', at: 0.3 }, // collar + lapel
  { d: 'M194,58 C196,120 204,190 210,236', at: 0.45 }, // neckline
  { d: 'M173,103 L196,97', at: 0.6 }, // gorge
  { d: 'M172,196 Q175,245 173,294', at: 0.7 }, // dart
  { d: 'M148,296 L196,298 L196,310 L149,309 Z', at: 0.8 }, // flap pocket
  { d: 'M88,312 L121,318', at: 0.9 }, // cuff
];
const HALF_FILLS = [
  'M122,74 C104,84 98,112 96,150 L86,330 L122,336 L138,166 C128,148 128,110 122,74 Z',
  'M184,52 L122,74 C128,110 128,148 138,166 L146,262 L138,392 Q172,401 200,401 Q210,401 210,390 L210,56 Z',
];
const MIRROR = 'translate(420 0) scale(-1 1)';

/** A tailored jacket drawn as a technical flat. Decorative. */
export default function JacketDrawing() {
  return (
    <svg className="flat" viewBox="40 20 340 400" aria-hidden="true" focusable="false">
      <defs>
        <marker id="flat-arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M1,1 L9,5 L1,9" fill="none" stroke="#7A1F33" strokeWidth="1.4" />
        </marker>
      </defs>

      <g className="fade" style={delay(0.2)}>
        {HALF_FILLS.map((d) => (
          <path key={d} className="fl" d={d} />
        ))}
        <g transform={MIRROR}>
          {HALF_FILLS.map((d) => (
            <path key={d} className="fl" d={d} />
          ))}
        </g>
        <path className="shirt" d="M194,58 C196,120 204,190 210,236 C216,190 224,120 226,58 Q210,64 194,58 Z" />
      </g>

      {[undefined, MIRROR].map((transform) => (
        <g key={transform ?? 'left'} className="ln" transform={transform}>
          {HALF_LINES.map(({ d, at }) => (
            <path key={d} className="draw" pathLength={1} style={delay(at)} d={d} />
          ))}
        </g>
      ))}
      <g className="ln">
        <path className="draw" pathLength={1} style={delay(0.5)} d="M184,52 Q210,44 236,52" />
        <path className="draw" pathLength={1} style={delay(1)} d="M250,192 L277,188 L277,195 L251,199 Z" />
      </g>
      <g className="fade" style={delay(1.2)}>
        <circle className="bt" cx="210" cy="262" r="4.5" />
        <circle className="bt" cx="210" cy="302" r="4.5" />
      </g>
      <g className="fade" style={delay(1.3)}>
        <path className="stitch" d="M157,114 C170,160 195,204 212,230" />
        <path className="stitch" d="M263,114 C250,160 225,204 208,230" />
      </g>
      <path className="measure fade" style={delay(1.4)} d="M142,206 H278" markerStart="url(#flat-arrow)" markerEnd="url(#flat-arrow)" />
    </svg>
  );
}
