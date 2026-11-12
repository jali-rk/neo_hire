import { useEffect, useState } from 'react';

/** A floating "Apply now" button on phones. Hidden over the hero and the form. */
export default function MobileApplyBar() {
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    const targets = ['top', 'apply'].map((id) => document.getElementById(id)).filter((el): el is HTMLElement => !!el);
    if (!('IntersectionObserver' in window) || targets.length === 0) {
      setHidden(false);
      return;
    }
    const visible = new Map<string, boolean>();
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => visible.set(en.target.id, en.isIntersecting));
      setHidden([...visible.values()].some(Boolean));
    });
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, []);

  return (
    <a className={`btn btn-primary m-apply${hidden ? ' is-hidden' : ''}`} href="#apply" aria-hidden={hidden} tabIndex={hidden ? -1 : 0}>
      Apply now
    </a>
  );
}
