import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Root-domain hosts (Vercel, Netlify, ...) serve this at "/". Only the
  // GitHub Pages project-page workflow needs the "/olympus-saju/" subpath,
  // so it opts in explicitly via this env var at build time.
  base: process.env.GITHUB_PAGES === 'true' ? '/olympus-saju/' : '/',
});
