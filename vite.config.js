import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';

// Relative base + single-file output: dist/index.html is fully self-contained
// (JS, CSS and fonts inlined), so it works on Vercel, on any static server,
// and when opened directly from disk via file://.
const stripDevOnly = {
  name: 'strip-dev-only',
  apply: 'build',
  transformIndexHtml: (html) => html.replace(/\s*<!-- dev-only:start -->[\s\S]*?<!-- dev-only:end -->/, ''),
};

export default defineConfig({
  base: './',
  plugins: [react(), stripDevOnly, viteSingleFile()],
  build: {
    assetsInlineLimit: 100000000,
    cssCodeSplit: false,
  },
});
