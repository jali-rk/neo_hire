import { HIRING_STEPS } from '../content';

export default function Process() {
  return (
    <section className="section section-paper" id="process" aria-labelledby="process-title">
      <div className="wrap split">
        <div className="split-aside">
          <p className="eyebrow">How we hire</p>
          <h2 className="title" id="process-title">
            What happens <em>after you apply.</em>
          </h2>
          <p className="intro">Five steps, with no surprises. You’ll know where you stand at each one.</p>
        </div>

        <ol className="timeline">
          {HIRING_STEPS.map((step, i) => (
            <li key={step.title}>
              <span className="n">{i + 1}</span>
              <h3>
                {step.title}
                {step.tag && <span className="tag">{step.tag}</span>}
              </h3>
              <p>{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
