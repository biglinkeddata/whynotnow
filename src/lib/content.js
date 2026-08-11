// Loads the editable content in /content into plain objects.
// Markdown files are bundled at build via import.meta.glob, so nothing
// here touches the filesystem at runtime.

import site from '../../content/site.json';
import quotesFile from '../../content/quotes.json';

export { site };
export const quotes = quotesFile.quotes;

const hostModules = import.meta.glob('../../content/hosts/*.md', { eager: true });
const guestModules = import.meta.glob('../../content/guests/*.md', { eager: true });
const noteModules = import.meta.glob('../../content/episode-notes/*.md', { eager: true });

function fileSlug(path) {
  return path.split('/').pop().replace(/\.md$/, '');
}

export const hosts = Object.entries(hostModules)
  .map(([path, mod]) => ({ id: fileSlug(path), ...mod.frontmatter, Content: mod.Content }))
  .sort((a, b) => (a.order ?? 99) - (b.order ?? 99));

export const guests = Object.entries(guestModules)
  .map(([path, mod]) => ({ id: fileSlug(path), ...mod.frontmatter, Content: mod.Content }))
  .filter((g) => !g.draft)
  .sort((a, b) => (a.order ?? 99) - (b.order ?? 99));

export const guestById = new Map(
  Object.entries(guestModules).map(([path, mod]) => [
    fileSlug(path),
    { id: fileSlug(path), ...mod.frontmatter, Content: mod.Content },
  ])
);

export const episodeNotes = new Map(
  Object.entries(noteModules)
    .filter(([path]) => !path.endsWith('README.md'))
    .map(([path, mod]) => [
      mod.frontmatter?.episodeSlug || fileSlug(path),
      { ...mod.frontmatter, Content: mod.Content },
    ])
);

// Social platforms in canonical display order, live ones only.
const SOCIAL_META = [
  ['instagram', 'Instagram'],
  ['threads', 'Threads'],
  ['tiktok', 'TikTok'],
  ['facebook', 'Facebook'],
  ['linkedin', 'LinkedIn'],
  ['youtube', 'YouTube'],
  ['spotify', 'Spotify'],
  ['applePodcasts', 'Apple Podcasts'],
];

export const liveSocials = SOCIAL_META
  .map(([key, label]) => ({ key, label, ...(site.social[key] || {}) }))
  .filter((s) => s.live && s.url);
