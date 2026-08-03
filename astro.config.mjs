import { defineConfig } from 'astro/config';
import netlify from '@astrojs/netlify';

// Server output so episode pages are generated live from the RSS feed
// (with caching in src/lib/feed.js). Deployed on Netlify; pages render
// in a Netlify Function.
export default defineConfig({
  site: 'https://whynotnowpod.com',
  output: 'server',
  adapter: netlify(),
  vite: {
    // Lets a Cloudflare quick tunnel reach the dev server for phone previews.
    server: { allowedHosts: ['.trycloudflare.com'] },
  },
});
