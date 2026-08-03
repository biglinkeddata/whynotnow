import { defineConfig } from 'astro/config';
import node from '@astrojs/node';

// Server output so episode pages are generated live from the RSS feed
// (with caching in src/lib/feed.js). Deploy anywhere Node runs, or swap
// the adapter for Vercel/Netlify without touching the pages.
export default defineConfig({
  site: 'https://whynotnowpod.com',
  output: 'server',
  adapter: node({ mode: 'standalone' }),
  vite: {
    // Lets a Cloudflare quick tunnel reach the dev server for phone previews.
    server: { allowedHosts: ['.trycloudflare.com'] },
  },
});
