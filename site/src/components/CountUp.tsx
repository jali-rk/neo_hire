import { useEffect, useRef, useState } from 'react';

/**
 * Counts a figure like "03", "14-day" or "360°" up from zero when it scrolls into view.
 * Values that don't start with a number (e.g. "CLO 3D") are shown as they are.
 * Screen readers always get the final value.
 */
export default function CountUp({ value, className }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState(value);

  useEffect(() => {
    const m = /^(\d+)(.*)$/.exec(value);
    const el = ref.current;
    if (!m || !el || window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;
    const r = el.getBoundingClientRect();
    if (r.top < window.innerHeight && r.bottom > 0) return; // already on screen: leave the final value

    const target = parseInt(m[1], 10);
    const pad = m[1].length;
    const suffix = m[2];
    const format = (n: number) => String(n).padStart(pad, '0') + suffix;
    setShown(format(0));

    let raf = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const t0 = performance.now();
        const step = (now: number) => {
          const k = Math.min(1, (now - t0) / 1600);
          setShown(format(Math.round(target * (1 - Math.pow(1 - k, 3)))));
          if (k < 1) raf = requestAnimationFrame(step);
        };
        raf = requestAnimationFrame(step);
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value]);

  return (
    <span ref={ref} className={className}>
      <span aria-hidden="true">{shown}</span>
      <span className="sr-only">{value}</span>
    </span>
  );
}
