# Episode extras

Episode titles, audio and show notes come straight from the podcast
RSS feed, so you never need to add those here.

This folder is for the *extras* on each episode page: the guest
biography, key takeaways and links. Create one file per episode named
after the episode slug (the ending of its web address), e.g.
`episode-3-jane-smith.md`:

```
---
episodeSlug: "episode-3-jane-smith"
guest: "jane-smith"          # the guest's filename in content/guests, without .md
themes: ["Business", "Starting over"]
takeaways:
  - "The scariest email she ever sent, and what happened next"
  - "Why 'I'll do it when the kids leave home' was the lie she told longest"
  - "Her rule for deciding in 48 hours"
links:
  - label: "Jane's bakery"
    url: "https://example.com"
---

Anything written down here appears as additional notes on the
episode page.
```

If an episode has no file here, its page still works. It just shows
the show notes from the feed.
