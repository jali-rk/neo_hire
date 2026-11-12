// Runs after `vite build`:
// 1. Renders the page to static HTML, so search engines and link previews see the
//    full content before any JavaScript runs.
// 2. If SITE_URL is set (e.g. SITE_URL=https://careers.example.lk pnpm build), adds the
//    tags that need an absolute URL: canonical, og:url, og:image, plus a sitemap.
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const ssrDir = path.join(root, 'dist-ssr');

const templatePath = path.join(dist, 'index.html');
const template = await fs.readFile(templatePath, 'utf8');
if (!template.includes('<!--app-html-->')) {
  throw new Error('Could not find <!--app-html--> in dist/index.html');
}

const { render } = await import(pathToFileURL(path.join(ssrDir, 'entry-server.js')).href);
let html = template.replace('<!--app-html-->', render());

const siteUrl = (process.env.SITE_URL ?? '').trim().replace(/\/+$/, '');
if (siteUrl) {
  if (!/^https?:\/\/[^/]+/.test(siteUrl)) throw new Error(`SITE_URL must be a full URL, like https://careers.example.lk (got "${siteUrl}")`);
  const tags = [
    `<link rel="canonical" href="${siteUrl}/" />`,
    `<meta property="og:url" content="${siteUrl}/" />`,
    `<meta property="og:image" content="${siteUrl}/og-image.png" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:image:alt" content="Build the foundation with us. Careers at Aphrodite (Pvt) Ltd." />`,
  ];
  html = html
    .replace(/<meta name="twitter:card" content="summary"\s*\/?>/, '<meta name="twitter:card" content="summary_large_image" />')
    .replace('</head>', `  ${tags.join('\n    ')}\n  </head>`);

  await fs.writeFile(
    path.join(dist, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>${siteUrl}/</loc></url>\n</urlset>\n`,
  );
  await fs.appendFile(path.join(dist, 'robots.txt'), `Sitemap: ${siteUrl}/sitemap.xml\n`);
  console.log(`Added canonical, og:url, og:image and sitemap for ${siteUrl}`);
} else {
  console.warn('SITE_URL not set: skipped canonical, og:url, og:image and sitemap. Set it for production builds.');
}

await fs.writeFile(templatePath, html);
await fs.rm(ssrDir, { recursive: true, force: true });
console.log('Pre-rendered dist/index.html');
