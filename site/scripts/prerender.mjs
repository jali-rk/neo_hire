// Renders the page to static HTML after `vite build`, so search engines and
// link previews see the full content before any JavaScript runs.
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
await fs.writeFile(templatePath, template.replace('<!--app-html-->', render()));
await fs.rm(ssrDir, { recursive: true, force: true });

console.log('Pre-rendered dist/index.html');
