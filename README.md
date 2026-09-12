# Settings of Humanity

Unified public civic-data website with a **desktop Settings–style** layout.

**Charter (nonnegotiable):** Jesus-shaped but nonsectarian — truth before virality; human dignity; poverty focus; evidence hierarchy; causation discipline (`changed-after` / `correlated` / `plausibly contributed` / `caused`); method transparency; fair representation + right of response; visible corrections; peaceful civic purpose. No clickbait, rage-bait, tribal framing, or dehumanization.

## Flagship framing

**Household Security** (food / energy / income burden vs politics) is the primary civic signal. Politics overlays report **correlation**, not party credit. Media Attention and Documented Associations are secondary panes — attention ≠ moral priority; presence ≠ guilt.

## Sections (hash routes)

| Hash | Section |
|------|---------|
| `#general` | Overview, dignity teaser, moral standards, what you can do |
| `#household` | **Flagship** — food/energy/income burden charts & caveats |
| `#scorecard` | Better World Scorecard — 12 indicators |
| `#media` | YouTube overall / left / right Top 10 + historical timeline |
| `#associations` | Epstein DAI summary, party charts, methodology |
| `#updates` | NEWS feed from `data/updates.json` |
| `#standards` | Methodology, corrections log, sources |

## Layout

```
settings-of-humanity/
  index.html
  css/styles.css
  js/app.js
  data/          # updates, scorecard, site_numbers, DAI, YouTube JSON/CSV
  assets/        # PNG charts copied from cost-of-living, restaurant-inflation, political-data
  vercel.json
  README.md
```

Companion (kept intact): `/workspace/youtube-audiences-site/`

## Local preview

```bash
cd /workspace/settings-of-humanity && python3 -m http.server 8765
# open http://127.0.0.1:8765/
```

## Deploy

```bash
# GitHub (when authenticated as bellenots)
gh repo create settings-of-humanity --public --source=. --remote=origin --push

# Vercel
vercel --prod
```

## Data vintage

Embedded numbers as of **2026-09-12** from existing exports — do not invent figures for copy.
