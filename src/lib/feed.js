import Parser from 'rss-parser';
import site from '../../content/site.json';

// Server-side RSS fetch with an in-memory cache. The whole site treats
// "no episodes" as a normal state (pre-launch), never an error: any
// failure here returns the last good result, or an empty list.

const TTL_MS = 15 * 60 * 1000; // refetch at most every 15 minutes

const parser = new Parser({
  timeout: 10000,
  customFields: {
    feed: [['itunes:image', 'itunesImage'], ['itunes:author', 'itunesAuthor']],
    item: [
      ['itunes:duration', 'duration'],
      ['itunes:episode', 'episodeNumber'],
      ['itunes:season', 'seasonNumber'],
      ['itunes:image', 'itunesImage'],
      ['itunes:summary', 'itunesSummary'],
      ['content:encoded', 'contentEncoded'],
    ],
  },
});

let cache = { at: 0, data: null };

export function slugify(text) {
  return String(text)
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80) || 'episode';
}

function formatDuration(raw) {
  if (!raw) return '';
  const s = String(raw).trim();
  if (s.includes(':')) {
    const parts = s.split(':').map(Number);
    const secs = parts.reduce((acc, p) => acc * 60 + p, 0);
    return formatDuration(secs);
  }
  const secs = parseInt(s, 10);
  if (!Number.isFinite(secs)) return '';
  const h = Math.floor(secs / 3600);
  const m = Math.round((secs % 3600) / 60);
  return h > 0 ? `${h} hr ${m} min` : `${m} min`;
}

function stripHtml(html) {
  return String(html || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

function normalise(feed) {
  const seen = new Map();
  const episodes = (feed.items || [])
    .filter((item) => item.enclosure?.url || item.link)
    .map((item) => {
      let slug = slugify(item.title || item.guid || 'episode');
      const n = seen.get(slug) || 0;
      seen.set(slug, n + 1);
      if (n > 0) slug = `${slug}-${n + 1}`;
      const html = item.contentEncoded || item.content || item.itunesSummary || '';
      const text = stripHtml(html);
      return {
        slug,
        guid: item.guid || item.link || slug,
        title: item.title || 'Untitled episode',
        date: item.isoDate || item.pubDate || null,
        audioUrl: item.enclosure?.url || '',
        audioType: item.enclosure?.type || 'audio/mpeg',
        duration: formatDuration(item.duration),
        durationRaw: item.duration || '',
        episodeNumber: item.episodeNumber || null,
        seasonNumber: item.seasonNumber || null,
        image: item.itunesImage?.href || item.itunesImage?.$?.href || null,
        descriptionHtml: html,
        descriptionText: text,
        excerpt: text.length > 220 ? `${text.slice(0, 217).trimEnd()}…` : text,
        categories: (item.categories || []).map((c) => (typeof c === 'string' ? c : c?._ || '')).filter(Boolean),
        link: item.link || null,
      };
    });

  return {
    title: feed.title || 'Why Not Now?',
    description: stripHtml(feed.description),
    image: feed.itunesImage?.href || feed.itunesImage?.$?.href || feed.image?.url || null,
    episodes,
  };
}

/**
 * Returns { title, description, image, episodes: [] }.
 * episodes is [] when the feed is unset, empty or unreachable —
 * callers use that to render the pre-launch state.
 */
export async function getFeed() {
  const url = site.rssUrl?.trim();
  if (!url) return { title: 'Why Not Now?', description: '', image: null, episodes: [] };

  const now = Date.now();
  if (cache.data && now - cache.at < TTL_MS) return cache.data;

  try {
    const feed = await parser.parseURL(url);
    cache = { at: now, data: normalise(feed) };
    return cache.data;
  } catch (err) {
    console.error(`[feed] fetch failed (${err?.message}); serving ${cache.data ? 'stale cache' : 'empty feed'}`);
    if (cache.data) return cache.data; // stale is better than broken
    return { title: 'Why Not Now?', description: '', image: null, episodes: [] };
  }
}

export async function getEpisode(slug) {
  const { episodes } = await getFeed();
  return episodes.find((e) => e.slug === slug) || null;
}
