import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // Relative asset paths, so the built site works from a domain root or a sub-folder.
  base: './',
  plugins: [react()],
});
