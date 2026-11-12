// Browser QA for the built site: drives headless Chrome over the DevTools protocol,
// clicks through the key flows, checks console errors and saves screenshots.
// Usage: pnpm build && pnpm preview   (in another terminal)  then  pnpm qa
// Set CHROME=/path/to/chrome if Chrome isn't at the default macOS location.
import { spawn } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';

const [url = "http://localhost:4173/", outDir = "qa-output"] = process.argv.slice(2);
await fs.mkdir(outDir, { recursive: true });
const CHROME = process.env.CHROME ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const PORT = 9333;
const profile = await fs.mkdtemp(path.join(os.tmpdir(), 'cdp-'));
const chrome = spawn(CHROME, ['--headless=new', '--disable-gpu', '--hide-scrollbars', `--remote-debugging-port=${PORT}`, `--user-data-dir=${profile}`, 'about:blank'], { stdio: 'ignore' });
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

let targets;
for (let i = 0; i < 50; i++) {
  try { targets = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json(); if (targets.length) break; } catch {}
  await wait(200);
}
const page = targets.find((t) => t.type === 'page');
const ws = new WebSocket(page.webSocketDebuggerUrl);
await new Promise((r) => ws.addEventListener('open', r, { once: true }));

let id = 0;
const pending = new Map();
const logs = [];
ws.addEventListener('message', (ev) => {
  const msg = JSON.parse(ev.data);
  if (msg.id && pending.has(msg.id)) { pending.get(msg.id)(msg); pending.delete(msg.id); return; }
  if (msg.method === 'Runtime.consoleAPICalled') logs.push(`[console.${msg.params.type}] ` + msg.params.args.map((a) => a.value ?? a.description ?? '').join(' '));
  if (msg.method === 'Runtime.exceptionThrown') logs.push('[exception] ' + (msg.params.exceptionDetails.exception?.description ?? msg.params.exceptionDetails.text));
  if (msg.method === 'Log.entryAdded' && ['error', 'warning'].includes(msg.params.entry.level)) logs.push(`[log.${msg.params.entry.level}] ${msg.params.entry.text} ${msg.params.entry.url ?? ''}`);
});
const send = (method, params = {}) => new Promise((resolve, reject) => {
  const mid = ++id;
  pending.set(mid, (m) => (m.error ? reject(new Error(method + ': ' + m.error.message)) : resolve(m.result)));
  ws.send(JSON.stringify({ id: mid, method, params }));
});
const evaluate = async (expr) => {
  const r = await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true });
  if (r.exceptionDetails) throw new Error('eval failed: ' + (r.exceptionDetails.exception?.description ?? r.exceptionDetails.text));
  return r.result.value;
};
const shot = async (name, opts = {}) => {
  const r = await send('Page.captureScreenshot', { format: 'png', ...opts });
  await fs.writeFile(path.join(outDir, name), Buffer.from(r.data, 'base64'));
};
const viewport = (width, height, mobile = false) => send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile });
const load = async (u) => {
  await send('Page.navigate', { url: u });
  await wait(3500);
};

await send('Runtime.enable');
await send('Log.enable');
await send('Page.enable');

const results = {};

/* ---------- Desktop ---------- */
await viewport(1440, 1000);
await load(url);
results.title = await evaluate('document.title');
results.heroLines = await evaluate(`Math.round(document.querySelector('.hero h1').getBoundingClientRect().height / parseFloat(getComputedStyle(document.querySelector('.hero h1')).lineHeight))`);
await shot('qa-hero-1440.png');
await send('Runtime.evaluate', { expression: `document.querySelector('.sheet').scrollIntoView({ behavior: 'instant' }); window.scrollBy(0, -90)` });
await wait(300);
await shot('qa-sheet-1440.png');
results.hydrated = await evaluate(`!!document.querySelector('#root')._reactRootContainer || Object.keys(document.querySelector('#root')).some(k => k.startsWith('__reactContainer'))`);

// Spec row B opens role B
results.specRowOpensRole = await evaluate(`(async () => {
  document.querySelector('.pom-row[href="#role-b"]').click();
  await new Promise(r => setTimeout(r, 400));
  return { open: document.getElementById('role-b').open, hash: location.hash };
})()`);

// Hover sync: hovering row C highlights pin C
results.hoverSync = await evaluate(`(async () => {
  const row = document.querySelector('.pom-row[href="#role-c"]');
  row.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
  row.dispatchEvent(new MouseEvent('mouseenter', { bubbles: false }));
  await new Promise(r => setTimeout(r, 200));
  return { rowActive: row.classList.contains('is-active'), pinActive: document.querySelector('.pin[href="#role-c"]').classList.contains('is-active') };
})()`);

// Apply for role B preselects the role
results.applyPreselect = await evaluate(`(async () => {
  document.querySelector('#role-b .role-actions .btn').click();
  await new Promise(r => setTimeout(r, 900));
  return { role: document.getElementById('f-role').value, focused: document.activeElement && document.activeElement.id };
})()`);

// Empty submit shows errors
results.emptySubmit = await evaluate(`(async () => {
  const sel = document.getElementById('f-role');
  Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value').set.call(sel, '');
  sel.dispatchEvent(new Event('change', { bubbles: true }));
  await new Promise(r => setTimeout(r, 100));
  document.querySelector('#apply form').requestSubmit();
  await new Promise(r => setTimeout(r, 300));
  return {
    errors: [...document.querySelectorAll('#apply .err')].map(e => e.textContent).filter(Boolean),
    status: document.querySelector('.form-status').textContent,
    focused: document.activeElement && document.activeElement.id,
    invalid: [...document.querySelectorAll('#apply [aria-invalid="true"]')].map(e => e.id),
  };
})()`);
await send('Runtime.evaluate', { expression: `document.getElementById('apply').scrollIntoView({ behavior: 'instant' })` });
await wait(300);
await shot('qa-form-errors-1440.png');

// Valid submit is blocked by the placeholder-email guard (no navigation)
results.validSubmit = await evaluate(`(async () => {
  const set = (id, v) => {
    const el = document.getElementById(id);
    const proto = el.tagName === 'SELECT' ? HTMLSelectElement.prototype : el.tagName === 'TEXTAREA' ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
    Object.getOwnPropertyDescriptor(proto, 'value').set.call(el, v);
    el.dispatchEvent(new Event(el.tagName === 'SELECT' ? 'change' : 'input', { bubbles: true }));
  };
  set('f-role', 'QA & Sourcing Executive');
  set('f-name', 'Test Person');
  set('f-email', 'test@example.org');
  set('f-phone', '+94 77 123 4567');
  set('f-exp', '5–9 years');
  set('f-link', 'behance.net/test');
  document.getElementById('f-link').dispatchEvent(new FocusEvent('focusout', { bubbles: true }));
  document.getElementById('f-link').blur();
  if (!document.getElementById('f-consent').checked) document.getElementById('f-consent').click();
  await new Promise(r => setTimeout(r, 200));
  const before = location.href;
  document.querySelector('#apply form').requestSubmit();
  await new Promise(r => setTimeout(r, 500));
  return {
    errors: [...document.querySelectorAll('#apply .err')].map(e => e.textContent).filter(Boolean),
    status: document.querySelector('.form-status').textContent,
    stayed: location.href === before,
    link: document.getElementById('f-link').value,
    action: document.querySelector('#apply form').getAttribute('action'),
    subject: document.querySelector('#apply input[name="_subject"]').value,
    next: document.querySelector('#apply input[name="_next"]').value,
  };
})()`);

// Mailto links
results.mailto = await evaluate(`document.querySelector('#role-d .role-actions .text-link').getAttribute('href').slice(0, 90)`);

// Success state after FormSubmit redirect
await evaluate(`sessionStorage.setItem('aph-applied', JSON.stringify({ name: 'Kavindi Perera', role: 'Senior Pattern Maker (Womenswear & Tailoring)' }))`);
await load(url.replace(/\/?$/, '/') + '?applied=1#apply');
results.success = await evaluate(`({ text: document.querySelector('.success') && document.querySelector('.success').innerText.slice(0, 200), url: location.href })`);
await shot('qa-success-1440.png');

/* ---------- Mobile ---------- */
await viewport(390, 844, true);
await load(url);
await shot('qa-mobile-hero.png');
results.mobileOverflow = await evaluate(`document.documentElement.scrollWidth > window.innerWidth ? document.documentElement.scrollWidth : false`);
await send('Runtime.evaluate', { expression: `document.querySelector('.sheet').scrollIntoView({ behavior: 'instant' })` });
await wait(400);
await shot('qa-mobile-sheet.png');
await send('Runtime.evaluate', { expression: `document.getElementById('role-a').open = true; document.getElementById('role-a').scrollIntoView({ behavior: 'instant' })` });
await wait(500);
await shot('qa-mobile-role.png');
await send('Runtime.evaluate', { expression: `document.getElementById('apply').scrollIntoView({ behavior: 'instant' })` });
await wait(500);
await shot('qa-mobile-apply.png');

// Mobile menu
results.mobileMenu = await evaluate(`(async () => {
  window.scrollTo(0, 0);
  await new Promise(r => setTimeout(r, 200));
  document.querySelector('.menu-btn').click();
  await new Promise(r => setTimeout(r, 200));
  const opened = !document.getElementById('mobile-nav').hidden;
  document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
  await new Promise(r => setTimeout(r, 200));
  return { opened, closedByEscape: document.getElementById('mobile-nav').hidden };
})()`);

/* ---------- Tablet ---------- */
await viewport(820, 1180, true);
await load(url);
await shot('qa-tablet-hero.png');
results.tabletOverflow = await evaluate(`document.documentElement.scrollWidth > window.innerWidth ? document.documentElement.scrollWidth : false`);
await send('Runtime.evaluate', { expression: `document.getElementById('roles').scrollIntoView({ behavior: 'instant' })` });
await wait(400);
await shot('qa-tablet-roles.png');

/* ---------- Keyboard (real key events, so :focus-visible applies) ---------- */
await viewport(1440, 1000);
await load(url);
const press = async (key, code, keyCode) => {
  const base = { key, code, windowsVirtualKeyCode: keyCode, nativeVirtualKeyCode: keyCode };
  await send('Input.dispatchKeyEvent', { type: 'rawKeyDown', ...base });
  if (key === 'Enter') await send('Input.dispatchKeyEvent', { type: 'char', text: '\r', ...base });
  if (key === ' ') await send('Input.dispatchKeyEvent', { type: 'char', text: ' ', ...base });
  await send('Input.dispatchKeyEvent', { type: 'keyUp', ...base });
  await wait(60);
};
const describeFocus = `(() => {
  const el = document.activeElement;
  if (!el || el === document.body) return null;
  let ring = getComputedStyle(el).outlineStyle !== 'none' && parseFloat(getComputedStyle(el).outlineWidth) > 0;
  if (el.closest('svg')) ring = parseFloat(getComputedStyle(el.querySelector('circle:not(.hit)')).strokeWidth) > 0;
  if (el.type === 'file') ring = getComputedStyle(el.nextElementSibling).outlineStyle !== 'none';
  if (el.classList.contains('input')) ring = getComputedStyle(el).boxShadow !== 'none';
  const r = el.getBoundingClientRect();
  const label = (el.getAttribute('aria-label') || el.innerText || el.id || el.tagName).trim().replace(/\\s+/g, ' ').slice(0, 36);
  return { tag: el.tagName.toLowerCase(), label, ring, onScreen: r.width > 0 && r.right > 0 && r.left < innerWidth };
})()`;
const stops = [];
for (let i = 0; i < 70; i++) {
  await press('Tab', 'Tab', 9);
  stops.push(await evaluate(describeFocus));
}
results.keyboard = {
  firstStopIsVisibleSkipLink: stops[0]?.label === 'Skip to content' && stops[0]?.onScreen,
  stopsWithoutFocusRing: stops.filter((s) => s && !s.ring).map((s) => `${s.tag}: ${s.label}`),
  stopsOffScreen: stops.filter((s) => s && !s.onScreen).map((s) => `${s.tag}: ${s.label}`),
  order: stops.map((s) => (s ? `${s.tag}: ${s.label}` : '(body)')),
};
await evaluate(`document.querySelector('#role-c summary').focus()`);
await press('Enter', 'Enter', 13);
const openedByEnter = await evaluate(`document.getElementById('role-c').open`);
await press(' ', 'Space', 32);
const closedBySpace = !(await evaluate(`document.getElementById('role-c').open`));
results.keyboard.roleToggle = { openedByEnter, closedBySpace };

/* ---------- Accessibility tree and headings ---------- */
await evaluate(`document.querySelectorAll('details').forEach(d => d.open = true)`);
await wait(200);
await send('Accessibility.enable');
const ax = await send('Accessibility.getFullAXTree');
const controls = ['link', 'button', 'textbox', 'combobox', 'checkbox', 'DisclosureTriangle'];
results.unnamedControls = ax.nodes
  .filter((n) => !n.ignored && controls.includes(n.role?.value) && !(n.name?.value || '').trim())
  .map((n) => n.role.value);
results.headingOutline = await evaluate(`(() => {
  const hs = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')];
  const skips = [];
  hs.forEach((h, i) => { const lvl = +h.tagName[1], prev = i ? +hs[i - 1].tagName[1] : 0; if (lvl > prev + 1) skips.push(h.tagName + ' after H' + prev + ': ' + h.textContent.trim().slice(0, 40)); });
  return { count: hs.length, skips };
})()`);

await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
await viewport(1440, 1000);
await load(url);
results.reducedMotion = await evaluate(`(() => { const cs = getComputedStyle(document.querySelector('.flat .draw')); return { animation: cs.animationName, dashoffset: cs.strokeDashoffset, pinOpacity: getComputedStyle(document.querySelector('.flat .pin')).opacity }; })()`);
results.consoleAndErrors = logs;
console.log(JSON.stringify(results, null, 2));
ws.close();
chrome.kill();
await wait(500);
await fs.rm(profile, { recursive: true, force: true }).catch(() => {});
