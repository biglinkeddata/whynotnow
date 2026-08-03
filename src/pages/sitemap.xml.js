import { getFeed } from '../lib/feed.js';

const STATIC = [
  '', 'about/', 'episodes/', 'guests/', 'become-a-guest/',
  'sponsor/', 'contact/', 'newsletter/', 'press-kit/',
];

export async function GET({ site }) {
  const base = site?.href || 'https://whynotnowpod.com/';
  const feed = await getFeed();
  const urls = [
    ...STATIC.map((p) => `${base}${p}`),
    ...feed.episodes.map((e) => `${base}episodes/${e.slug}/`),
  ];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${u}</loc></url>`).join('\n')}
</urlset>`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml' } });
}
