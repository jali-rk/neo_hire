import { useEffect, useRef } from 'react';

/*
  Live silk-satin backdrop for the hero, drawn with a single WebGL fragment shader.
  - Folds drift slowly; the cloth ripples gently around the pointer.
  - Renders at reduced resolution and pauses when off-screen or in a background tab.
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

float folds(vec2 p, float t) {
  // Long, mostly parallel folds (like satin draped on a diagonal), gently warped
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

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * uRes) / uRes.y;
  vec2 p = uv * 1.9;
  float t = uTime;
  float e = 0.003;
  float h0 = height(p, t);
  float dx = (height(p + vec2(e, 0.0), t) - h0) / e;
  float dy = (height(p + vec2(0.0, e), t) - h0) / e;
  vec3 n = normalize(vec3(-dx * 0.55, -dy * 0.55, 1.0));

  // Light comes across the folds, so each fold catches a streak of highlight
  vec3 L = normalize(vec3(0.5, 0.42, 0.62));
  vec3 H = normalize(L + vec3(0.0, 0.0, 1.0));
  float diff = max(dot(n, L), 0.0);
  float nh = max(dot(n, H), 0.0);
  float spec = pow(nh, 34.0);
  float sheen = pow(nh, 5.0);

  vec3 shadow = vec3(0.04, 0.028, 0.033);
  vec3 garnet = vec3(0.33, 0.07, 0.12);
  vec3 col = mix(shadow, garnet, pow(diff, 1.6));
  col += vec3(0.55, 0.2, 0.26) * sheen * 0.06;
  col += vec3(0.98, 0.85, 0.68) * spec * 0.42;

  float vig = smoothstep(1.45, 0.25, length(uv * vec2(0.8, 1.1)));
  col *= mix(0.45, 1.0, vig);
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
      // Soft folds don't need full resolution: render smaller and let the browser scale up.
      const scale = Math.min(window.devicePixelRatio || 1, 1.5) * 0.6;
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
