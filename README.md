# Why Not Now? — whynotnowpod.com

The home of a movement about reinvention that happens to have a podcast
as its first product. Built with [Astro](https://astro.build) in server
mode so episode pages come live from the podcast RSS feed.

## Run it

```bash
npm install
npm run dev        # local dev at http://localhost:4321
npm run build      # production build to dist/
```

Deploys on Netlify (`@astrojs/netlify` adapter): every push to `main`
triggers a deploy. Pages render server-side in a Netlify Function.

## Editing the site (no code needed)

Everything an editor touches lives in **`/content`**:

| File | What it controls |
| --- | --- |
| `content/site.json` | RSS feed URL, Kit form ID, form endpoint, social links (+ per-platform `live` switches), contact emails, show descriptions |
| `content/hosts/*.md` | Host names, photos, short bios and full biographies |
| `content/guests/*.md` | Guest roster — copy `example-guest.md`, set `draft: false` to publish |
| `content/quotes.json` | The big quote cards |
| `content/episode-notes/*.md` | Per-episode extras: guest link, themes, key takeaways, links (see the README in that folder) |

### Launch checklist

1. **RSS**: paste the feed URL into `rssUrl` in `content/site.json`.
   The homepage switches from pre-launch to the episode hero automatically.
   Episodes, players, episode pages and the sitemap all follow the feed.
   (The feed is cached for 15 minutes; failures fall back to the last good
   fetch, never an error page.)
2. **Newsletter**: create a form in Kit (ConvertKit) and paste its form ID
   into `kitFormId`. Every email box on the site posts straight to Kit.
3. **Forms**: Contact / Become a Guest / Sponsor submissions arrive in
   the Netlify dashboard under Forms (enable email notifications there
   to get them by email). No setup needed. If you ever change a form's
   fields, update `public/__forms.html` to match.
4. **Socials**: flip `live: true` per platform as each account launches;
   buttons and icons appear automatically.
5. **Imagery**: host photos, cover art and the stacked logo are the real
   Canva exports (in `public/images/`). Still placeholder: guest photos
   (add real ones per guest in `content/guests/`).

## Where things live

- `src/pages/` — one file per page (Home, About, Episodes + per-episode,
  Guests, Become a Guest, Sponsor, Contact, Newsletter, Press Kit, 404)
- `src/lib/feed.js` — server-side RSS fetch/parse/cache
- `src/styles/global.css` — the design system (palette, outlined display
  type, brush pills, marker underlines, star bullets, quote grid)
- `public/textures/` — the painted brush-stroke SVG backgrounds
# whynotnow
