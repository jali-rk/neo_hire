import { useEffect, useRef, useState } from 'react';
import { ATELIER, CONFIG } from '../content';
import JacketDrawing from './JacketDrawing';
import { PauseIcon, PlayIcon } from './Icons';

const assetUrl = (path: string) => (/^https?:\/\//.test(path) ? path : `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`);

/**
 * The virtual fitting film. Plays muted and looped, with a pause button
 * (it doesn't autoplay for people who prefer reduced motion).
 * Until a film is added in CONFIG.fitOnVideo, the jacket drawing is shown instead.
 */
export default function FitOnVideo() {
  const { src, webm, poster } = CONFIG.fitOnVideo;
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const v = video.current;
    if (!v) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!reduce) v.play().catch(() => setPlaying(false));
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
    if (v.paused) v.play().catch(() => undefined);
    else v.pause();
  }

  return (
    <figure className="film">
      <div className="film-frame">
        <video
          ref={video}
          muted
          loop
          playsInline
          preload="metadata"
          poster={poster ? assetUrl(poster) : undefined}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
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
