import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { ATELIER, CONFIG } from '../content';
import JacketDrawing from './JacketDrawing';
import { PauseIcon, PlayIcon } from './Icons';

const assetUrl = (path: string) => (/^https?:\/\//.test(path) ? path : `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`);

/**
 * The virtual fitting film: muted, looped, with a pause button.
 * Web-optimised: nothing downloads until the film is near the screen, and it only
 * plays while visible. It never autoplays for people who prefer reduced motion.
 * Until a film is added in CONFIG.fitOnVideo, the jacket drawing is shown instead.
 */
export default function FitOnVideo() {
  const { src, webm, poster, width, height } = CONFIG.fitOnVideo;
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const pausedByUser = useRef(false);

  useEffect(() => {
    const v = video.current;
    if (!v || !('IntersectionObserver' in window)) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !pausedByUser.current) v.play().catch(() => setPlaying(false));
        else if (!entry.isIntersecting) v.pause();
      },
      { threshold: 0.35 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  if (!src) {
    return (
      <figure className="film film-placeholder paper">
        <JacketDrawing />
        <figcaption>{ATELIER.videoCaption}</figcaption>
      </figure>
    );
  }

  function toggle() {
    const v = video.current;
    if (!v) return;
    if (v.paused) {
      pausedByUser.current = false;
      v.play().catch(() => undefined);
    } else {
      pausedByUser.current = true;
      v.pause();
    }
  }

  return (
    <figure className="film">
      <div className="film-frame" style={{ '--ar': `${width} / ${height}`, '--arw': width / height } as CSSProperties}>
        <video
          ref={video}
          muted
          loop
          playsInline
          preload="none"
          poster={poster ? assetUrl(poster) : undefined}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          width={width}
          height={height}
          aria-label="Virtual fitting film"
        >
          {webm && <source src={assetUrl(webm)} type="video/webm" />}
          <source src={assetUrl(src)} type="video/mp4" />
        </video>
        <button className="film-toggle" type="button" onClick={toggle} aria-label={playing ? 'Pause film' : 'Play film'}>
          {playing ? <PauseIcon /> : <PlayIcon />}
          <span>{playing ? 'Pause' : 'Play'}</span>
        </button>
      </div>
      <figcaption>{ATELIER.videoCaption}</figcaption>
    </figure>
  );
}
