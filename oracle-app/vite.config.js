import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Served as a GitHub Pages project site at /olympus-saju/, not the domain root.
  base: '/olympus-saju/',
});
