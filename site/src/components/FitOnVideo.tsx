import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { ATELIER, CONFIG } from '../content';
import JacketDrawing from './JacketDrawing';
import { PauseIcon, PlayIcon } from './Icons';

/** Relative paths, so the site works from a domain root or a sub-folder. */
const assetUrl = (path: string) => (/^https?:\/\//.test(path) ? path : path.replace(/^\//, ''));

/**
 * The virtual fitting film: plays automatically (muted, looped) whenever it's on screen.
 * - Web-optimised: nothing downloads until the film is near the screen; it pauses off-screen.
 * - Some browsers block autoplay (e.g. Safari or iPhone in Low Power Mode). Then it starts on the
 *   visitor's first tap, click or key press anywhere, and a large play button shows meanwhile.
 * - It doesn't autoplay for people who ask their device for reduced motion (they can press play).
 * - Until a film is added in CONFIG.fitOnVideo, the jacket drawing is shown instead.
 */
export default function FitOnVideo() {
  const { src, webm, poster, width, height } = CONFIG.fitOnVideo;
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const pausedByUser = useRef(false);
  const inView = useRef(false);

  useEffect(() => {
    const v = video.current;
    if (!v || !('IntersectionObserver' in window)) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // Browsers only autoplay muted video; set it on the element itself to be sure.
    v.muted = true;
    v.defaultMuted = true;

    const gestures = ['pointerdown', 'touchend', 'keydown'] as const;
    const retry = () => {
      gestures.forEach((g) => document.removeEventListener(g, retry));
      if (inView.current && !pausedByUser.current) tryPlay();
    };
    const tryPlay = () => {
      v.play()
        .then(() => setBlocked(false))
        .catch(() => {
          // Autoplay blocked: start on the first interaction anywhere on the page.
          setBlocked(true);
          gestures.forEach((g) => document.addEventListener(g, retry, { once: true, passive: true }));
        });
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        inView.current = entry.isIntersecting;
        if (entry.isIntersecting && !pausedByUser.current) tryPlay();
        else if (!entry.isIntersecting) v.pause();
      },
      { threshold: 0.3 },
    );
    io.observe(v);
    return () => {
      io.disconnect();
      gestures.forEach((g) => document.removeEventListener(g, retry));
    };
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
      v.muted = true;
      v.play().then(() => setBlocked(false)).catch(() => undefined);
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
        {blocked && !playing ? (
          <button className="film-play" type="button" onClick={toggle}>
            <span className="film-play-ring" aria-hidden="true">
              <PlayIcon />
            </span>
            <span>Play film</span>
          </button>
        ) : (
          <button className="film-toggle" type="button" onClick={toggle} aria-label={playing ? 'Pause film' : 'Play film'}>
            {playing ? <PauseIcon /> : <PlayIcon />}
            <span>{playing ? 'Pause' : 'Play'}</span>
          </button>
        )}
      </div>
      <figcaption>{ATELIER.videoCaption}</figcaption>
    </figure>
  );
}
