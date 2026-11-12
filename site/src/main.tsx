import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import '@fontsource-variable/source-serif-4/opsz.css';
import '@fontsource-variable/source-sans-3/index.css';
import './styles.css';
import App from './App';

const root = document.getElementById('root')!;
const app = (
  <StrictMode>
    <App />
  </StrictMode>
);

// The production build is pre-rendered to HTML (see scripts/prerender.mjs), so
// hydrate it. In development the root is empty, so render from scratch.
if (root.firstElementChild) hydrateRoot(root, app);
else createRoot(root).render(app);
