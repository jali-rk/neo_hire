import { CONFIG, FAQS } from '../content';
import { mailto } from '../lib/mailto';
import { PlusIcon } from './Icons';

export default function Faq() {
  return (
    <section className="section" id="faq" aria-labelledby="faq-title">
      <div className="wrap split">
        <div className="split-aside">
          <p className="eyebrow">FAQ</p>
          <h2 className="title" id="faq-title">
            Before you apply.
          </h2>
          <p className="intro">
            Something else on your mind? Email us at{' '}
            <a className="text-link" href={mailto()}>
              {CONFIG.careersEmail}
            </a>
            .
          </p>
        </div>

        <div>
          {FAQS.map((item) => (
            <details className="qa" key={item.q}>
              <summary>
                {item.q}
                <span className="chev" aria-hidden="true">
                  <PlusIcon />
                </span>
              </summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
