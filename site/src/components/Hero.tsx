import type { CSSProperties } from 'react';
import { HERO } from '../content';
import { ArrowIcon } from './Icons';
import SilkCanvas from './SilkCanvas';

const delay = (s: number) => ({ '--d': `${s}s` }) as CSSProperties;

export default function Hero() {
  return (
    <section className="hero dark" id="top" aria-labelledby="hero-title">
      <SilkCanvas />
      <div className="hero-veil" aria-hidden="true" />

      <div className="wrap hero-inner">
        <div className="hero-copy">
          <p className="eyebrow intro-fade" style={delay(0.2)}>
            {HERO.eyebrow}
          </p>
          <h1 id="hero-title">
            {HERO.titleLines.map((line, i) => (
              <span className="line" key={line}>
                <span style={delay(0.35 + i * 0.14)}>{line}</span>
              </span>
            ))}
            <em className="line">
              <span style={delay(0.35 + HERO.titleLines.length * 0.14)}>{HERO.titleAccent}</span>
            </em>
          </h1>
          <p className="lede intro-fade" style={delay(0.95)}>
            {HERO.lede}
          </p>
          <div className="hero-actions intro-fade" style={delay(1.1)}>
            <a className="btn btn-light" href="#careers">
              {HERO.primaryCta} <ArrowIcon />
            </a>
            <a className="btn btn-outline-light" href="#company">
              {HERO.secondaryCta}
            </a>
          </div>
        </div>
      </div>

      <div className="wrap hero-foot intro-fade" style={delay(1.3)}>
        <a className="scroll-cue" href="#company">
          <span>Scroll to explore</span>
          <span className="scroll-line" aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
