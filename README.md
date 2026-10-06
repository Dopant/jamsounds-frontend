# JamJournal frontend

JamJournal is an independent music editorial site for emerging artists and listeners around the world. The frontend uses React, TypeScript, Vite, Tailwind CSS, shadcn/ui, and Tiptap.

## Local development

Use Node.js 22 or later. Install platform-specific dependencies from the lockfile:

```bash
npm ci
npm run dev
```

The development server listens on port 8080. `/api` and `/uploads` currently proxy to `https://backend.jamjournal.com`; change the Vite proxy to `http://localhost:4000` when running the backend locally.

```bash
npm run typecheck
npm run build
npm run preview
```

Set `VITE_PUBLIC_SITE_URL=https://jamjournal.com` when building for production. Use the same origin for the backend's `PUBLIC_SITE_URL`.

## Editorial experience

- The homepage rediscovery slideshow loads a shuffled selection of up to eight reviews from `/api/posts/rediscover`. It pauses on hover/focus, supports swipe and manual controls, and respects reduced-motion preferences.
- Public pages do not display readership counts, article totals, or rating scores. Readership analytics remain available in administration; admin pages verify the session before rendering and logout clears the stored token.
- JamJournal's X and YouTube channels are hidden publicly; artists may still include their own links.
- Artist links support Facebook, X, Spotify, YouTube, Apple Music, TikTok, Instagram, and an official website.
- The author follow button uses the JamJournal Instagram URL configured in admin settings.

## Production rendering and SEO

Deploy this build together with the backend editorial SEO change. Nginx serves `/assets/*` and `/jamjournal-logo.png` from this `dist` directory and proxies page HTML, APIs, uploads, robots, and sitemap requests to Express. Express injects safe initial public content, article metadata, canonical links, and JSON-LD into this build's `index.html`; React then renders the interactive page normally. This is initial HTML rendering, not React hydration, and does not use bot-specific responses.

Existing `/blog/post/:id` URLs are retained. Article metadata also updates during in-app navigation using an endpoint that does not increment readership counters.

See the backend README for Nginx deployment and Google Search Console steps. Do not deploy the Nginx rendering changes until the matching frontend build is available to the backend.
