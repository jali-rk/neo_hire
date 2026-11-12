import { useEffect, useRef } from 'react';

/*
  Hero backdrop: fine silk threads flowing over the folds of draped cloth, in champagne and stone
  on near-black, drawn by a single WebGL fragment shader. Mostly dark space; light only where threads catch it.
  - Folds drift slowly; the threads ripple around the pointer.
  - Pauses when off-screen or in a background tab.
  - Reduced motion: draws one still frame. No WebGL: the CSS gradient behind it shows instead.
*/

const VERT = `
attribute vec2 a;
void main() { gl_Position = vec4(a, 0.0, 1.0); }
`;

const FRAG = `
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uMouse;   // pointer, in the same space as p
uniform float uPress;  // 0..1, eases in while the pointer moves

// The surface of a draped length of silk: long, gently warped diagonal folds.
float folds(vec2 p, float t) {
  vec2 q = p;
  q += 0.42 * vec2(sin(p.y * 0.8 + t * 0.30), sin(p.x * 0.6 - t * 0.24));
  float a = sin(q.x * 2.6 + q.y * 1.9 + t * 0.46);
  float b = sin(q.x * 1.3 + q.y * 0.9 - t * 0.31 + 1.3) * 0.55;
  float c = sin(q.x * 5.0 + q.y * 3.9 + t * 0.62 + 2.1) * 0.1;
  return a * 0.6 + b + c;
}

float height(vec2 p, float t) {
  float h = folds(p, t);
  float d = length(p - uMouse);
  h += uPress * exp(-d * d * 3.2) * (0.3 + 0.16 * sin(d * 9.0 - t * 2.6));
  return h;
}

// Fine threads run across the folds; their spacing bends with the cloth.
float threadCoord(vec2 p, float h) {
  return (p.x * 0.5 - p.y * 0.9) * 9.5 + h * 1.7;
}

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * uRes) / uRes.y;
  float scale = 1.9;
  vec2 p = uv * scale;
  float t = uTime;
  float px = scale / uRes.y;             // one screen pixel, in p units

  float h0 = height(p, t);
  float hx = height(p + vec2(px, 0.0), t);
  float hy = height(p + vec2(0.0, px), t);

  // Light on the folds decides how brightly each thread catches it
  vec3 n = normalize(vec3(-(hx - h0) / px * 0.55, -(hy - h0) / px * 0.55, 1.0));
  vec3 L = normalize(vec3(0.5, 0.42, 0.62));
  float nh = max(dot(n, normalize(L + vec3(0.0, 0.0, 1.0))), 0.0);
  float glint = pow(nh, 18.0);
  float sheen = pow(nh, 4.0);

  // Anti-aliased hairlines, about one pixel wide at any resolution
  float c0 = threadCoord(p, h0);
  float cx = threadCoord(p + vec2(px, 0.0), hx);
  float cy = threadCoord(p + vec2(0.0, px), hy);
  float perPx = max(length(vec2(cx - c0, cy - c0)), 1e-4);
  float dist = abs(fract(c0 + 0.5) - 0.5) / perPx;
  float line = 1.0 - smoothstep(0.35, 1.25, dist);
  float accent = step(mod(floor(c0 + 0.5), 4.0), 0.5);   // every fourth thread is a gold one

  // Quiet on the left (behind the headline), richer to the right
  float mask = smoothstep(-0.7, 0.6, uv.x) * smoothstep(1.3, 0.3, length(uv * vec2(0.72, 1.0)));

  vec3 col = vec3(0.055, 0.04, 0.045);
  col += vec3(0.30, 0.07, 0.12) * sheen * 0.10 * mask;                 // faint garnet breath, not a fill
  vec3 stone = vec3(0.55, 0.50, 0.46);
  vec3 gold = vec3(0.86, 0.72, 0.52);
  float strength = mix(0.10 + 0.45 * glint, 0.24 + 0.95 * glint, accent);
  col += mix(stone, gold, accent) * line * strength * mask;
  // A soft halo on the gold threads where the light catches them
  float halo = exp(-dist * dist / 22.0) * accent * (0.04 + 0.16 * glint);
  col += gold * halo * mask;
  gl_FragColor = vec4(col, 1.0);
}
`;

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const s = gl.createShader(type);
  if (!s) return null;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null;
}

export default function SilkCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const gl = canvas.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'low-power' });
    if (!gl) return;

    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    const prog = gl.createProgram();
    if (!vs || !fs || !prog) return;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);

    // One triangle that covers the screen
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'a');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, 'uRes');
    const uTime = gl.getUniformLocation(prog, 'uTime');
    const uMouse = gl.getUniformLocation(prog, 'uMouse');
    const uPress = gl.getUniformLocation(prog, 'uPress');

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const mouse = { x: 0.9, y: 0.2, tx: 0.9, ty: 0.2, press: 0, tpress: 0 };
    let raf = 0;
    let running = false;
    let visible = true;
    let lastMove = 0;
    const t0 = performance.now();

    const resize = () => {
      // Hairlines need real pixels; cap the density so large screens stay light.
      const scale = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.max(1, Math.round(canvas.clientWidth * scale));
      canvas.height = Math.max(1, Math.round(canvas.clientHeight * scale));
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    const draw = (now: number) => {
      const t = reduce ? 14 : (now - t0) / 1000;
      mouse.x += (mouse.tx - mouse.x) * 0.06;
      mouse.y += (mouse.ty - mouse.y) * 0.06;
      if (now - lastMove > 1200) mouse.tpress = 0;
      mouse.press += (mouse.tpress - mouse.press) * 0.04;
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, t);
      gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.uniform1f(uPress, mouse.press);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const loop = (now: number) => {
      draw(now);
      raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (running || reduce || !visible || document.hidden) return;
      running = true;
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const onPointer = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      if (e.clientY > r.bottom) return;
      // Same coordinate space as the shader's p
      mouse.tx = ((e.clientX - r.left - r.width / 2) / r.height) * 2.2;
      mouse.ty = ((r.height / 2 - (e.clientY - r.top)) / r.height) * 2.2;
      mouse.tpress = 1;
      lastMove = performance.now();
    };
    const onResize = () => {
      resize();
      if (reduce) draw(performance.now());
    };
    const onVisibility = () => (document.hidden ? stop() : start());

    resize();
    draw(performance.now());
    canvas.classList.add('is-ready');

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
      else stop();
    });
    io.observe(canvas);
    window.addEventListener('resize', onResize);
    window.addEventListener('pointermove', onPointer, { passive: true });
    document.addEventListener('visibilitychange', onVisibility);
    start();

    return () => {
      stop();
      io.disconnect();
      window.removeEventListener('resize', onResize);
      window.removeEventListener('pointermove', onPointer);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return <canvas ref={ref} className="silk" aria-hidden="true" />;
}
