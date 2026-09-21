# Kharch Karo 💸

**India's virtual spending playground.** Pick a wallet, blow it all on things you can't afford, collect your Damage Report. Zero real rupees. Maximum dopamine.

> Kharch Karo is a virtual entertainment experience. No real purchases are made through the game.

---

## What it is

A fully client-side, installable web game. Every product in the catalogue uses a **real, free-to-use photograph** hosted on the Unsplash CDN, so the collection genuinely feels like a storefront — but the checkout is imaginary and the money is pretend.

Demo video: `public/demo/kharch-karo-demo.mp4` (mobile cut at `public/demo/kharch-karo-demo-mobile.mp4`).

---

## Tech stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router, **static export**) |
| UI | React 19 + Tailwind CSS v4 |
| Language | TypeScript (strict) |
| Fonts | `next/font` — Space Grotesk (display) + Inter (body) |
| Database | Firebase Firestore (optional, graceful offline fallback) |
| Analytics | GA4 via `dataLayer` / `gtag` |
| Hosting | Firebase Hosting (free Spark plan) |
| Media | Unsplash CDN (free, credit shown in quick view) |
| Demo capture | Playwright + ffmpeg-static |

Everything above runs on free tiers. `output: "export"` means there is no server runtime at all.

---

## Getting started

```bash
npm install
copy .env.example .env.local   # optional — the app runs without it
npm run dev                    # http://localhost:3000
```

### Commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Local dev server |
| `npm run build` | Production static export into `out/` |
| `npm start` | Serve the built app |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` across the whole repo |
| `npm run verify` | Data + photo-CDN + config verification suite |
| `npm run smoke` | Playwright runtime test against the built `out/` |
| `npm test` | typecheck → lint → verify (the fast gate) |
| `npm run test:all` | `npm test` → build → runtime smoke (the full gate) |
| `npm run deploy` | `next build` then `firebase deploy --only hosting` |

---

## Environment variables

Every variable is optional — with none set, the game is 100% playable and simply skips the live backend.


---

## How the game works

1. **Choose your wallet** — ₹10K → ₹10Cr, or type a custom fantasy budget (up to ₹100Cr).
2. **Spend the collection** — 19 products across 6 categories (Tech, Fashion, Cars, Food, Travel, Flex). Filter by category or 🔥 Trending, search with `Ctrl/⌘ + K`, quick-view for a quantity stepper.
3. **Broke?** The Damage Report opens automatically: total burned, budget-burned %, purchase count, biggest flex, global rank, a spender personality, and a one-tap share card.

### Features

- **Wallet engine** — animated balance, burn progress bar, denial feedback ("The fantasy has limits 💀"), big-purchase `THAT HURT` toasts.
- **Real product photography** — free Unsplash CDN images on tiles, hero orbs, quick view, search results and the collection drawer.
- **Offline-proof images** — every photo has a gradient + emoji fallback if the CDN is unreachable.
- **Damage Report + 8 spender personalities** — Financial Menace, Tech Bro, Fit Check Icon, Car Guy, Certified Foodie, Jetsetter, Main Character, and the shamed Reluctant Spender.
- **Sharing** — Web Share API, WhatsApp deep link, and clipboard copy.
- **Dark / light theme** — persisted in `localStorage`.
- **PWA** — installable, with generated icons and manifest.
- **SEO / social** — metadata, keywords, OG + Twitter cards, generated OG image.
- **Visitor analytics** — IP geolocation (ipapi.co) into an admin dashboard at `/admin`.
- **Global leaderboard** — anonymous score submission to Firestore, with a seeded fallback wall.

---

## Project structure

```
kharch-karo/
├── src/
│   ├── app/
│   │   ├── page.tsx              # entry → <KharchApp />
│   │   ├── layout.tsx            # fonts, metadata, theme, optional GA4
│   │   ├── globals.css           # Tailwind v4 tokens + animations
│   │   ├── admin/page.tsx        # visitor analytics dashboard
│   │   ├── manifest.ts           # PWA manifest
│   │   ├── icon.tsx / apple-icon.tsx / opengraph-image.tsx
│   │   └── favicon.ico
│   ├── components/
│   │   ├── KharchApp.tsx         # app shell + section composition
│   │   ├── Hero.tsx              # headline + live photo orbs
│   │   ├── BudgetSelector.tsx    # wallet cards + custom budget
│   │   ├── WalletDisplay.tsx     # sticky HUD
│   │   ├── SpendingExperience.tsx# category discovery + grid
│   │   ├── ProductTile.tsx       # photo tile + quick add
│   │   ├── ProductImage.tsx      # <img> with emoji fallback
│   │   ├── ProductQuickView.tsx  # modal + qty stepper
│   │   ├── SearchOverlay.tsx     # Ctrl+K search
│   │   ├── CartDrawer.tsx        # Your Collection
│   │   ├── DamageReport.tsx      # stat sheet + score submit
│   │   ├── ShareCard.tsx         # share / WhatsApp / copy
│   │   ├── DailyChallenge.tsx    # countdown challenge
│   │   ├── Leaderboard.tsx       # live top spenders
│   │   ├── DamageWall.tsx / Faq.tsx / HowItWorks.tsx
│   │   ├── MobileBar.tsx / Navbar.tsx / Reveal.tsx
│   │   ├── providers/            # WalletProvider, ThemeProvider
│   │   └── ui/                   # button, card, drawer, modal, toast, …
│   ├── hooks/useAnimatedNumber.ts
│   └── lib/
│       ├── products.ts           # catalogue + real photo URLs
│       ├── format.ts             # budgets, parseBudget, formatINR
│       ├── personality.ts        # Damage Report engine
│       ├── leaderboard.ts        # Firestore scores + seed fallback
│       ├── geolocation.ts        # visits + stats
│       ├── analytics.ts          # GA4 event taxonomy
│       ├── firebase.ts           # env-driven, null-safe init
│       └── utils.ts

---

## Verification

`npm run verify` runs 26 assertions across five areas and is part of `npm test`:

```
catalogue
  ok   at least 18 products are stocked
  ok   every product id is unique
  ok   every product has a positive price
  ok   every product category is a known category
  ok   every category has at least one product
  ok   popularity scores sit in 0-100
  ok   every product is searchable (non-empty tags)
  ok   every product ships a real CDN photo + credit
  ok   every product keeps an emoji + gradient fallback for offline
  ok   trending() sorts by popularity and respects the limit

wallet engine
  ok   budgets are unique and ascending
  ok   parseBudget resolves every known budget
  ok   parseBudget falls back to Rs 1Cr for unknown input
  ok   formatINR uses Indian digit grouping
  ok   greedy burn of the catalogue never overshoots the wallet
  ok   an unaffordable product is correctly denied

damage report
  ok   a full burn returns Financial Menace
  ok   top category drives the personality
  ok   spending nothing returns the Reluctant Spender
  ok   every personality is renderable

photo CDN
  ok   all 19 product photos resolve (HTTP 200)

config
  ok   firebase.json serves the static export and caches assets
  ok   firestore.rules keeps scores and visits append-only
  ok   next.config.ts enables static export (free Firebase Spark hosting)
  ok   .env.example documents every env var the app reads
  ok   demo videos are bundled for the footer link

26 passed, 0 failed
```

### Runtime smoke test

`npm run build && npm run smoke` serves the real `out/` export on a zero-dependency
static server and drives it with Playwright:

```
Kharch Karo — runtime smoke test (http://localhost:4173)

  ok   hero headline renders
  ok   budget step renders
  ok   product photos render (22/22 painted)
  ok   adding a product updates the collection count
  ok   collection drawer shows the total burned
  ok   Damage Report opens with a personality verdict
  ok   stat sheet shows the starting amount
  ok   share card is offered
  ok   restart clears the collection
  ok   no console or page errors during the whole run

10 passed, 0 failed
```

The `photos render` assertion is the important one: it proves every real Unsplash
photo was actually fetched **and decoded** (`naturalWidth > 0`) in a browser, not
just referenced in the source.

---

## Photos & licensing

All product photographs are served from the **Unsplash CDN** (`images.unsplash.com`) under the
[Unsplash License](https://unsplash.com/license) — free for commercial and non-commercial use,
no attribution required (credit is still shown in the quick view as a courtesy).

Photos are hot-linked with `w=800&q=80&auto=format` so tiles stay sharp and the static bundle
stays tiny. To swap a photo, change the `image:` field in `src/lib/products.ts` and re-run
`npm run verify` — the suite fails loudly if any URL stops resolving.

---

## Deploying to Firebase Hosting (free)

```bash
npm install -g firebase-tools
firebase login
firebase use --add            # pick your project

copy .env.example .env.local  # paste your real Firebase web config
npm run deploy                # next build && firebase deploy --only hosting
```

Then deploy the database rules once:

```bash
firebase deploy --only firestore:rules
```

After the first live session, `/admin` shows visitor locations and the leaderboard switches
from the **Demo** badge to **● Live**.

---

## Regenerating the demo video

```bash
npm run dev                                   # in one terminal
node scripts/record-demo.mjs desktop          # in another
node scripts/record-demo.mjs mobile
```

Output lands in `demo/`. The copies used by the footer live in `public/demo/`.

---

## Design notes

- Money is never real, and the UI says so in the quick view, the footer, and the Damage Report.
- Wallet state is centralised in `WalletProvider`; business logic lives in `src/lib`, never in components.
- Every interactive surface has a keyboard path (Escape closes overlays, `Ctrl/⌘ + K` opens search).
- Reduced-motion friendly: animations are transform/opacity based with `ease-cinematic` tokens.

├── scripts/
│   ├── verify.mts                # data + CDN + config suite (npm run verify)
│   ├── smoke.mjs                 # Playwright runtime test (npm run smoke)
│   └── record-demo.mjs           # Playwright demo recorder
├── public/demo/                  # demo videos
├── firebase.json                 # hosting + cache headers + firestore
├── firestore.rules               # append-only scores/visits
└── next.config.ts                # output: "export"
```

```bash
# Firebase (client SDK keys are public by design — safe to ship)
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Google Analytics 4 measurement ID, e.g. G-XXXXXXXXXX
NEXT_PUBLIC_GA_ID=

# Canonical URL used for OG / Twitter metadata
NEXT_PUBLIC_SITE_URL=https://kharch-karo.web.app
```

### What degrades gracefully

| Missing | Behaviour |
| --- | --- |
| Firebase keys | `db` is `null`. Leaderboard falls back to the seed wall, `submitScore` reports offline, sessions persist in `localStorage`. |
| `NEXT_PUBLIC_GA_ID` | Events still fill `window.dataLayer` — nothing breaks, nothing is sent. |
| Network / CDN | Any product photo that fails to load falls back to its gradient + emoji tile. |
